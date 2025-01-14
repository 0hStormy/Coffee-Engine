(function () {
    coffeeEngine.renderer.initilizeMaterials = () => {
        //? what does this do exactly?
        //* It stores material data. thats it;
        coffeeEngine.renderer.material = class {
            constructor(shader, params) {
                //Internal shaders
                if (shader.startsWith("coffee:/")) {
                    //Remove the coffee predesessor, and get the default shader
                    this.shader = coffeeEngine.renderer.mainShaders[shader.replace("coffee:/", "")];
                } else {
                    //Get it from the path
                    coffeeEngine.renderer.fileToShader(shader).then((shader) => {
                        this.shader = shader;
                    });
                }
                this.shaderPath = shader;
                this.params = params;
            }

            use() {
                //Loop through our params and set the keys
                if (this.shader) {
                    for (const key in this.params) {
                        if (this.shader.uniforms[key]) this.shader.uniforms[key].value = this.params[key];
                    }
                }

                if (this.shader.uniforms.u_time) this.shader.uniforms.u_time.value = coffeeEngine.timer;
            }
        };

        coffeeEngine.renderer.defaultMaterial = new coffeeEngine.renderer.material("coffee:/basis", {});
    };
})();
