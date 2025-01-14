//? Technically its a node, a very strange node yes. but like... a very distant cousin.
(function () {
    coffeeEngine.sceneClass = class {
        scenePath = coffeeEngine.defaultScenePath || "scenes/default.scene";
        fileReader = new FileReader();

        horizonColor = [0.77254902, 0.792156863, 0.909803922];
        skyColor = [0.403921569, 0.639215686, 0.941176471];
        groundColor = [0.290196078, 0.22745098, 0.192156863];
        centerColor = [0.2, 0.105882353, 0.0549019608];

        constructor() {
            this.children = [];
            this.events = {
                update: [],
                childAdded: [],
                childMoved: [],
            };
            this.drawList = [];

            this.name = "scene";

            this.fileReader.onload = () => {
                //Make sure our scene is JSON
                const parsed = JSON.parse(this.fileReader.result);
                if (!parsed) {
                    console.log(`"${this.scenePath}" is INVALID! Opening an empty scene with that path.`);
                    return;
                }

                //if it is deserialize it.
                this.deserialize(parsed);
            }
        }

        //Event listener stuff
        addEventListener(event, func) {
            if (typeof this.events[event] != "object") return;

            this.events[event].push(func);
            return func;
        }

        hasEventListener(event, func) {
            if (typeof this.events[event] != "object") return;

            return this.events[event].includes(func);
        }

        removeEventListener(event, func) {
            if (typeof this.events[event] != "object") return;

            if (this.events[event].includes(func)) {
                this.events[event].splice(this.events[event].indexOf(func), 1);
            }
        }

        //This is so we know what to draw like event listeners, but with nodes instead of functions
        addToDrawList(object) {
            this.drawList.push(object);
        }

        inDrawList(object) {
            return this.drawList.includes(object);
        }

        removeFromDrawList(object) {
            if (this.drawList.includes(object)) {
                this.drawList.splice(this.drawList.indexOf(object), 1);
            }
        }

        //Lets us cast an event
        castEvent(event, data) {
            for (const eventFunc in this.events[event]) {
                this.events[event][eventFunc](data);
            }
        }

        update(deltaTime) {
            this.castEvent("update", deltaTime);
        }

        draw() {
            const GL = coffeeEngine.renderer.daveshade.GL;
            coffeeEngine.renderer.daveshade.clear(GL.DEPTH_BUFFER_BIT);
            coffeeEngine.renderer.drawBuffer.use();
            this.__drawSky(coffeeEngine.renderer);
            coffeeEngine.renderer.daveshade.clear(GL.DEPTH_BUFFER_BIT);
            this.__drawScene(coffeeEngine.renderer);
            coffeeEngine.renderer.daveshade.renderToCanvas();
            coffeeEngine.renderer.daveshade.clear(GL.DEPTH_BUFFER_BIT);

            coffeeEngine.renderer.cameraData.res = [coffeeEngine.renderer.canvas.width, coffeeEngine.renderer.canvas.height];
            coffeeEngine.renderer.mainShaders.mainPass.setBuffers(coffeeEngine.shapes.plane);
            coffeeEngine.renderer.mainShaders.mainPass.uniforms.u_color.value = coffeeEngine.renderer.drawBuffer.attachments[0].texture;
            coffeeEngine.renderer.mainShaders.mainPass.uniforms.u_materialAttributes.value = coffeeEngine.renderer.drawBuffer.attachments[1].texture;
            //renderer.mainShaders.mainPass.uniforms.u_emission.value = coffeeEngine.renderer.drawBuffer.attachments[2].texture;
            //renderer.mainShaders.mainPass.uniforms.u_position.value = coffeeEngine.renderer.drawBuffer.attachments[3].texture;
            //renderer.mainShaders.mainPass.uniforms.u_normal.value = coffeeEngine.renderer.drawBuffer.attachments[4].texture;

            coffeeEngine.renderer.mainShaders.mainPass.drawFromBuffers(6);
        }

        __drawSky(renderer) {
            renderer.cameraData.res = [renderer.canvas.width, renderer.canvas.height];
            //renderer.mainShaders.skyPlane.uniforms.u_camera.value = this.matrix.webGLValue();
            renderer.mainShaders.skyplane.setBuffers(coffeeEngine.shapes.plane);
            renderer.mainShaders.skyplane.uniforms.horizonColor.value = this.horizonColor;
            renderer.mainShaders.skyplane.uniforms.skyColor.value = this.skyColor;
            renderer.mainShaders.skyplane.uniforms.groundColor.value = this.groundColor;
            renderer.mainShaders.skyplane.uniforms.centerColor.value = this.centerColor;

            renderer.mainShaders.skyplane.drawFromBuffers(6);
        }

        __drawScene(renderer) {
            //Sort em
            this.drawList.sort((node1, node2) => {
                //Don't spend the extra time recomputing the value
                let node1Sort = node1.sortValue(false);
                let node2Sort = node2.sortValue(false);
                if (node1Sort < node2Sort) {
                    return -1;
                } else if (node1Sort > node2Sort) {
                    return 1;
                }
                //Dual pass sorting, just in case two are the same value
                else {
                    node1Sort = node1.sortValue(true);
                    node2Sort = node2.sortValue(true);

                    if (node1Sort < node2Sort) {
                        return -1;
                    } else if (node1Sort > node2Sort) {
                        return 1;
                    }
                }

                return 0;
            });

            //Now lets draw the objects
            for (let drawItem = this.drawList.length - 1; drawItem >= 0; drawItem--) {
                const node = this.drawList[drawItem];
                node.draw();
            }
        }

        //Child management
        addChild(child) {
            if (child == this) return;
            if (this.children.includes(child)) return;
            this.children.push(child);
            if (!arguments[1]) child.parent = this;

            this.castEvent("childAdded", child);
        }

        removeChild(child) {
            if (child == this) return;

            if (!arguments[1]) child.parent = null;
            //Splice the child
            if (this.children.includes(child)) {
                this.children.splice(this.children.indexOf(child), 1);
            }
        }

        __clearChildren(node) {
            //Remove all children
            const childCount = node.children.length;
            for (let index = 0; index < childCount; index++) {
                this.__clearChildren(node.children[0]);
            }

            //Check if the node we are clearing is the scene
            if (node == this) return;
            //Remove them from events
            node.parent.removeChild(node);
            node.dispose();
            //Remove the child from memory, we have to rely on the garbage collector because this is 'strict' mode?
            node = null;
        }

        //Scene serialization and stuff
        serialize() {
            //We want to recursively go downwards and get the properties and types of each child
            const goDown = (children) => {
                const returnedObject = [];
                children.forEach((child) => {
                    const properties = {};

                    //Loop through child properties and validate/add each one
                    child.getProperties().forEach((property) => {
                        //Make sure its a property and not a label
                        if (typeof property != "object") return;

                        //Safeties
                        if (!child[property.name]) return;
                        if (child[property.name].serialize) properties[property.name] = child[property.name].serialize();
                        else properties[property.name] = child[property.name];
                    });

                    //Push the child to the returned object array
                    returnedObject.push({
                        name: child.name,
                        nodeType: coffeeEngine.getNodeName(child),
                        children: goDown(child.children),
                        properties: properties,
                    });
                });
                return returnedObject;
            };

            //Get our preloaded asset paths
            const keys = {};
            Object.keys(coffeeEngine.preloadFunctions).forEach(key => {
                //Make sure we have a preload function
                const preloadFunction = coffeeEngine.preloadFunctions[key];
                if (preloadFunction) {
                    //Then we get the keys
                    keys[key] = Object.keys(preloadFunction.storage);
                }
            });

            //Once we got all that juicy data we return our array
            return {
                name: this.name,
                nodeType: "scene",
                children: goDown(coffeeEngine.runtime.currentScene.children),
                preload: keys,

                //Serialize the sky
                skyColor:this.skyColor,
                horizonColor:this.horizonColor,
                groundColor:this.groundColor,
                centerColor:this.centerColor,
            };
        }

        deserialize(data) {
            //Set our colors from the file
            this.skyColor = data.skyColor || [0,0,0];
            this.horizonColor = data.horizonColor || [1,1,1];
            this.groundColor = data.groundColor || [1,1,1];
            this.centerColor = data.centerColor || [0,0,0];

            //Our function for actually loading the scene
            const loadNodes = () => {
                //Clear out children from memory and registry
                this.__clearChildren(this);
    
                //If we have no data assume this is a new scene
                if (!data) data = { name: "scene", nodeType: "scene", children: [] };
    
                //Rename the scene
                this.name = data.name;
    
                //Now we cycle through every child
                const _loopThroughChildren = (parent, physicalParent) => {
                    parent.children.forEach((child) => {
                        //Get our node class
                        const nodeClass = coffeeEngine.getNode(child.nodeType) || coffeeEngine.getNode("Node");
                        const node = new nodeClass();
                        node.name = child.name;
                        node.parent = physicalParent;
    
                        //Loop through the node's properties
                        Object.keys(child.properties).forEach((property) => {
                            //Make sure we aren't using a ""PROTOTYPE"" definition
                            const propertyData = child.properties[property];
                            if (typeof propertyData == "object" && propertyData["/-_-PROTOTYPE-_-/"]) {
                                if (coffeeEngine[propertyData["/-_-PROTOTYPE-_-/"]] && coffeeEngine[propertyData["/-_-PROTOTYPE-_-/"]].deserialize) {
                                    coffeeEngine[propertyData["/-_-PROTOTYPE-_-/"]].deserialize(node[property], propertyData.value);
                                }
                            } else {
                                node[property] = propertyData;
                            }
                        });
    
                        _loopThroughChildren(child, node);
                    });
                };
    
                _loopThroughChildren(data, this);

            }

            //Check if preload exists
            if (!data.preload) {
                loadNodes();
                return;
            }

            //Get our count of preloaded data
            const preloadCount = Object.values(data.preload).flat(2).length;
            let preloadFinished = 0;

            //Then load them
            Object.keys(data.preload).forEach(preloadCategory => {
                //Make sure the category has a preload function
                const preloadFunction = coffeeEngine.preloadFunctions[preloadCategory];
                //If it does preload the data
                if (preloadFunction) {
                    data.preload[preloadCategory].forEach(path => {
                        preloadFunction.function(path).then(() => {
                            //Increment our preload finished, and check if we are done
                            preloadFinished++;
                            if (preloadFinished == preloadCount) {
                                loadNodes();
                            };
                        }).catch(() => {
                            //!THIS "ERROR" SOMETIMES WORKS SOMETIMES DOESN'T
                            //!FOR SOME REASON IT ERRORS AT 'default.material' AND ONLY 'default.material'
                            //!EVEN THOUGH WE RESOLVE THE PROMISE BEFORE IT CAN EVEN CHECK FOR 'default.material' IN THE MAIN FILESYSTEM!
                            //Increment our preload finished, and check if we are done
                            preloadFinished++;
                            if (preloadFinished == preloadCount) {
                                loadNodes();
                            };
                        });
                    })
                }
            })
        }

        openScene(path) {
            project.getFile(path).then(file => {
                if (file) {
                    this.scenePath = path;
                    this.fileReader.readAsText(file);
                }
            })
        }

        getProperties() {
            return [
                {name: "skyColor", translationKey:"engine.nodeProperties.scene.skyColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true},
                {name: "horizonColor", translationKey:"engine.nodeProperties.scene.horizonColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true},
                {name: "groundColor", translationKey:"engine.nodeProperties.scene.groundColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true},
                {name: "centerColor", translationKey:"engine.nodeProperties.scene.centerColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true},
            ];

            //Input Testing stuff
            /*
            return [
                {name: "INT", type: coffeeEngine.PropertyTypes.INT},
                {name: "FLOAT", type: coffeeEngine.PropertyTypes.FLOAT},
                {name: "VEC2", type: coffeeEngine.PropertyTypes.VEC2},
                {name: "VEC3", type: coffeeEngine.PropertyTypes.VEC3},
                {name: "VEC4", type: coffeeEngine.PropertyTypes.VEC4},
                {name: "VEC5", type: "vec5"},
                {name: "VEC6", type: "vec6"},
                {name: "COLOR3", type: coffeeEngine.PropertyTypes.COLOR3},
                {name: "COLOR4", type: coffeeEngine.PropertyTypes.COLOR4},
                {name: "NODE", type: coffeeEngine.PropertyTypes.NODE},
                {name: "FILE", type: coffeeEngine.PropertyTypes.FILE},
                {name: "STRING", type: coffeeEngine.PropertyTypes.STRING},
                {name: "NAME", type: coffeeEngine.PropertyTypes.NAME},
                {name: "ARRAY", type: coffeeEngine.PropertyTypes.ARRAY},
                {name: "OBJECT", type: coffeeEngine.PropertyTypes.OBJECT},
            ]
            */
        }
    };

    //Make current scene our scene class
    coffeeEngine.runtime.currentScene = new coffeeEngine.sceneClass();
})();
