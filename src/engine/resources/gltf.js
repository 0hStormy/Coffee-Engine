(function () {
    coffeeEngine.mesh.settings.glb = {
        useBytes:true
    };

    coffeeEngine.mesh.parsers.glb = (contents, meshData) => {
        meshData.data = [];
        meshData.pointCount = [];
        const data = meshData.data;
        const pointCount = meshData.pointCount;

        //Convert it to a intArray
        contents = new Uint8Array(contents);
        
        //Make sure our first 4 bytes are glTF
        const magic = String.fromCharCode(contents[0],contents[1],contents[2],contents[3]);
        if (magic != "glTF") return;

        

        //Flatten em
        const dataLength = data.length - 1;
        data[dataLength].a_position = new Float32Array(data[dataLength].a_position.flat(4));
        data[dataLength].a_texCoord = new Float32Array(data[dataLength].a_texCoord.flat(4));
        data[dataLength].a_normal = new Float32Array(data[dataLength].a_normal.flat(4));
        data[dataLength].a_color = new Float32Array(data[dataLength].a_color.flat(4));
    };
})();
