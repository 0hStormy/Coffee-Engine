window.sugarcube = {};
sugarcube.blockStyles = {};
sugarcube.extensions = {};
sugarcube.buttons = {};
sugarcube.contextMenuBlockCorrolations = {};
//Using a custom variable system to store more data.
//Blockly variables aren't inherently bad. Just limited.
sugarcube.variables = {
    storage: {},
    getAll: () => {
        return Object.values(sugarcube.variables.storage);
    },
    createVariable: (Name, Type, Color, DefaultValue) => {
        sugarcube.variables.storage[Name] = {
            name: Name,
            type: Type,
            color: Color,
            defaultValue: DefaultValue || "",
        };
    },
};

//For custom blocks
sugarcube.customBlocks = {
    fieldTypes: [],
    storage: {},
    blockFromDefinition: (jsonDef) => {
        const swagStyledBuisness = {};

        let conjugatedName = "";

        jsonDef.parameters.forEach((param) => {
            delete param.element;

            if (!swagStyledBuisness[param.name]) swagStyledBuisness[param.name] = 0;

            swagStyledBuisness[param.name] += 1;

            param.id = `${param.type}_${param.name}_${swagStyledBuisness[param.name]}`;

            conjugatedName += param.id;
        });

        if (sugarcube.customBlocks.storage[conjugatedName]) {
            alert("This block exists");
            return;
        }

        sugarcube.customBlocks.storage[conjugatedName] = jsonDef;

        const myBlockDec = sugarcube.workspace.newBlock("myblocks_declaration");
        myBlockDec.initSvg();
        myBlockDec.render();
        myBlockDec.loadExtraState(jsonDef);
    },
    addCustomFieldToPrompt: (Name, Type, ImageURL, ExtraParameters) => {
        const newField = {
            Name: Name,
            Type: Type,
            Image: ImageURL,
            createFunction: ExtraParameters.createFunction,
            parseFunction: ExtraParameters.parseFunction,
            declaration: ExtraParameters.declaration,
        };

        sugarcube.customBlocks.fieldTypes.push(newField);
    },
};

sugarcube.toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "search",
            name: "Search",
            contents: [],
        },
    ],
};
sugarcube.menus = {};

sugarcube.constantOverrides = {};

sugarcube.blocklyTheme = {
    blockStyles: {},
    fontStyle: {
        family: "helvetica",
        weight: 500,
        size: 12,
    },
    componentStyles: {
        workspaceBackgroundColour: "#1e1e1e",

        toolboxBackgroundColour: "#333",
        toolboxForegroundColour: "#fff",

        flyoutBackgroundColour: "#252526",
        flyoutForegroundColour: "#ccc",
        flyoutOpacity: 0.5,

        scrollbarColour: "#797979",
        scrollbarOpacity: 0.4,

        insertionMarkerColour: "#fff",
        insertionMarkerOpacity: 0.3,

        cursorColour: "#d0d0d0",

        unseenBackground: "#1e1e1e",
    },
    startHats: true,
};

sugarcube.inject = (container) => {
    //Sugarcube only supports one workspace;
    if (sugarcube.workspace) sugarcube.workspace.dispose();

    sugarcube.workspace = Blockly.inject(container, {
        collapse: false,
        comments: true,
        toolbox: sugarcube.toolbox,
        theme: sugarcube.blocklyTheme,
        renderer: "sugarcube", //"Thrasos",
        grid: {
            spacing: 40,
            length: 3,
            colour: "#484848",
            snap: false,
        },
        zoom: {
            controls: true,
            wheel: false,
            startScale: 0.8,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
            pinch: true,
        },
        move: {
            scrollbars: {
                horizontal: true,
                vertical: true,
            },
            drag: true,
            wheel: true,
        },
        trashcan: false, // we don't want the recycling bin. Maybe it can be an option though?
        plugins: {
            toolbox: sugarcube.ContinuousToolbox,
            flyoutsVerticalToolbox: sugarcube.ContinuousFlyout,
            metricsManager: sugarcube.ContinuousMetrics,
        },
    });

    sugarcube.workspace.addChangeListener(Blockly.Events.disableOrphans);

    //Register existing buttons
    Object.keys(sugarcube.buttons).forEach((buttonID) => {
        sugarcube.workspace.registerButtonCallback(buttonID, sugarcube.buttons[buttonID]);
    });

    return sugarcube.workspace;
};

sugarcube.refreshTheme = () => {
    sugarcube.workspace.setTheme(Blockly.Theme.defineTheme("sugarcube", sugarcube.blocklyTheme));
    //sugarcube.minimapWorkspace.setTheme(Blockly.Theme.defineTheme("sugarcube", sugarcube.blocklyTheme));

    //sugarcube.minimapWorkspace.svgBackground_.style.fill = sugarcube.blocklyTheme.componentStyles.unseenBackground;
    //sugarcube.minimapWorkspace.scrollbar.setVisible(false);
    //sugarcube.minimapWorkspace.injectionDiv.parentElement.style.transition = "opacity 500ms";
};

sugarcube.easyColourBlock = (block, color) => {
    //Define the colours
    const convertedColors = sugarcube.blockColorFunction(
        color,
        color,
        color,
        null,
        null,
    );

    //Apply the colours
    block.style = {
        colourPrimary: convertedColors[0],
        colourSecondary: convertedColors[1],
        colourTertiary: convertedColors[2],
        colourQuaternary: convertedColors[3],
        colourQuinary: convertedColors[4],
        useBlackWhiteFields: convertedColors[5],
        colourIdentifier: convertedColors[6] || convertedColors[0],
        useEverywhere: convertedColors[7],
        hat: "cap",
    }

    block.applyColour();
    if (!convertedColors[7]) block.setColour(color);
}