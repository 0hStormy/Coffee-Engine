(function () {
    coffeeEngine.matrix4 = class {
        constructor(contents) {
            this.contents = contents;
        }

        rotationX(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix4([
                [1,0,0,0],
                [0,Math.cos(rad),Math.sin(rad),0],
                [0,-Math.sin(rad),Math.cos(rad),0],
                [0,0,0,1]
            ])
            return this.multiply(rotator);
        }

        rotationY(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix4([
                [Math.cos(rad),0,Math.sin(rad),0],
                [0,1,0,0],
                [-Math.sin(rad),0,Math.cos(rad),0],
                [0,0,0,1]
            ])
            return this.multiply(rotator);
        }

        rotationZ(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix4([
                [Math.cos(rad),Math.sin(rad),0,0],
                [-Math.sin(rad),Math.cos(rad),0,0],
                [0,0,1,0],
                [0,0,0,1]
            ]);
            return this.multiply(rotator);
        }
        /*

1.0 - 2.0*y*y - 2.0*z*z, 2.0*x*y - 2.0*z*w, 2.0*x*z + 2.0*y*w, 0.0,
2.0*x*y + 2.0*z*w, 1.0 - 2.0*x*x - 2.0*z*z, 2.0*y*z - 2.0*x*w, 0.0,
2.0*x*z - 2.0*y*w, 2.0*y*z + 2.0*x*w, 1.0 - 2.0*x*x - 2.0*y*y, 0.0,
0.0, 0.0, 0.0, 1.0
        */

        rotateQuaternion(qx,qy,qz,qw) {
            //const rotator = new coffeeEngine.matrix4([
            //    [1.0 - 2.0*y*y - 2.0*z*z, 2.0*x*y - 2.0*z*w, 2.0*x*z + 2.0*y*w, 0.0,],
            //    [2.0*x*y + 2.0*z*w, 1.0 - 2.0*x*x - 2.0*z*z, 2.0*y*z - 2.0*x*w, 0.0,],
            //    [2.0*x*z - 2.0*y*w, 2.0*y*z + 2.0*x*w, 1.0 - 2.0*x*x - 2.0*y*y, 0.0,],
            //    [0.0, 0.0, 0.0, 1.0]
            //]);
            var te = this.elements;

            var x = qx, y = qy, z = qz, w = qw;
            var x2 = x + x, y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2;
            var yy = y * y2, yz = y * z2, zz = z * z2;
            var wx = w * x2, wy = w * y2, wz = w * z2;
            
            const rotator = new coffeeEngine.matrix4([
                [1 - ( yy + zz ),xy + wz,xz - wy,0],
                [xy - wz,1 - ( xx + zz ),yz + wx,0],
                [xz + wy,yz - wx,1 - ( xx + yy ),0],
                [0,0,0,1]
            ]);
            return this.multiply(rotator);
        }

        translate(x, y, z) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix4([
                [1,0,0,x],
                [0,1,0,y],
                [0,0,1,z],
                [0,0,0,1]
            ])
            return this.multiply(rotator);
        }

        scale(x, y, z) {
            const scalor = coffeeEngine.matrix4.identity();
            scalor.contents[0][0] *= x;
            scalor.contents[1][1] *= y;
            scalor.contents[2][2] *= z;

            return this.multiply(scalor);
        }
        /*
        ? Generated the table below using this function
(function(){
    let conglomerated = "";
    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
            conglomerated += `this.contents[${row}][0] * matrix.contents[0][${column}] + this.contents[${row}][1] * matrix.contents[1][${column}] + this.contents[${row}][2] * matrix.contents[2][${column}] + this.contents[${row}][3] * matrix.contents[3][${column}],\n`;
        }
    }

    return conglomerated
})()
        ?Is it kinda useless?
        *Yeah

        ?Is it probably faster?
        *probably
        */
        multiply(matrix) {
            //* I am speed
            // prettier-ignore
            return new coffeeEngine.matrix4([
                [this.contents[0][0] * matrix.contents[0][0] + this.contents[0][1] * matrix.contents[1][0] + this.contents[0][2] * matrix.contents[2][0] + this.contents[0][3] * matrix.contents[3][0],
                this.contents[0][0] * matrix.contents[0][1] + this.contents[0][1] * matrix.contents[1][1] + this.contents[0][2] * matrix.contents[2][1] + this.contents[0][3] * matrix.contents[3][1],
                this.contents[0][0] * matrix.contents[0][2] + this.contents[0][1] * matrix.contents[1][2] + this.contents[0][2] * matrix.contents[2][2] + this.contents[0][3] * matrix.contents[3][2],
                this.contents[0][0] * matrix.contents[0][3] + this.contents[0][1] * matrix.contents[1][3] + this.contents[0][2] * matrix.contents[2][3] + this.contents[0][3] * matrix.contents[3][3]],
                [this.contents[1][0] * matrix.contents[0][0] + this.contents[1][1] * matrix.contents[1][0] + this.contents[1][2] * matrix.contents[2][0] + this.contents[1][3] * matrix.contents[3][0],
                this.contents[1][0] * matrix.contents[0][1] + this.contents[1][1] * matrix.contents[1][1] + this.contents[1][2] * matrix.contents[2][1] + this.contents[1][3] * matrix.contents[3][1],
                this.contents[1][0] * matrix.contents[0][2] + this.contents[1][1] * matrix.contents[1][2] + this.contents[1][2] * matrix.contents[2][2] + this.contents[1][3] * matrix.contents[3][2],
                this.contents[1][0] * matrix.contents[0][3] + this.contents[1][1] * matrix.contents[1][3] + this.contents[1][2] * matrix.contents[2][3] + this.contents[1][3] * matrix.contents[3][3]],
                [this.contents[2][0] * matrix.contents[0][0] + this.contents[2][1] * matrix.contents[1][0] + this.contents[2][2] * matrix.contents[2][0] + this.contents[2][3] * matrix.contents[3][0],
                this.contents[2][0] * matrix.contents[0][1] + this.contents[2][1] * matrix.contents[1][1] + this.contents[2][2] * matrix.contents[2][1] + this.contents[2][3] * matrix.contents[3][1],
                this.contents[2][0] * matrix.contents[0][2] + this.contents[2][1] * matrix.contents[1][2] + this.contents[2][2] * matrix.contents[2][2] + this.contents[2][3] * matrix.contents[3][2],
                this.contents[2][0] * matrix.contents[0][3] + this.contents[2][1] * matrix.contents[1][3] + this.contents[2][2] * matrix.contents[2][3] + this.contents[2][3] * matrix.contents[3][3]],
                [this.contents[3][0] * matrix.contents[0][0] + this.contents[3][1] * matrix.contents[1][0] + this.contents[3][2] * matrix.contents[2][0] + this.contents[3][3] * matrix.contents[3][0],
                this.contents[3][0] * matrix.contents[0][1] + this.contents[3][1] * matrix.contents[1][1] + this.contents[3][2] * matrix.contents[2][1] + this.contents[3][3] * matrix.contents[3][1],
                this.contents[3][0] * matrix.contents[0][2] + this.contents[3][1] * matrix.contents[1][2] + this.contents[3][2] * matrix.contents[2][2] + this.contents[3][3] * matrix.contents[3][2],
                this.contents[3][0] * matrix.contents[0][3] + this.contents[3][1] * matrix.contents[1][3] + this.contents[3][2] * matrix.contents[2][3] + this.contents[3][3] * matrix.contents[3][3]]
            ]);
        }

        multiplyVector(vector) {
            const returned = new coffeeEngine.vector4(0, 0, 0, 0);
            // prettier-ignore
            returned.x = vector.x * this.contents[0][0] + vector.y * this.contents[0][1] + vector.z * this.contents[0][2] + vector.w * this.contents[0][3];
            // prettier-ignore
            returned.y = vector.x * this.contents[1][0] + vector.y * this.contents[1][1] + vector.z * this.contents[1][2] + vector.w * this.contents[1][3];
            // prettier-ignore
            returned.z = vector.x * this.contents[2][0] + vector.y * this.contents[2][1] + vector.z * this.contents[2][2] + vector.w * this.contents[2][3];
            // prettier-ignore
            returned.w = vector.x * this.contents[3][0] + vector.y * this.contents[3][1] + vector.z * this.contents[3][2] + vector.w * this.contents[3][3];
            return returned;
        }

        webGLValue() {
            return [...this.contents[0],...this.contents[1],...this.contents[2],...this.contents[3]];;
        }

        __duplicate(to) {
            to.contents = (new coffeeEngine.matrix4(this.contents)).contents;
        }

        serialize() {
            return { "/-_-PROTOTYPE-_-/": "matrix4", value: this.contents };
        }
    };

    coffeeEngine.matrix4.identity = () => {
        // prettier-ignore
        return new coffeeEngine.matrix4([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
        ]);
    };

    coffeeEngine.matrix4.projection = (fov, aspect, near, far) => {
        const fovRad = Math.tan(((fov * 0.5) / 180) * 3.141592682);
        const range = far - near;

        const returned = coffeeEngine.matrix4.identity();

        returned.contents[0][0] = fovRad / aspect;
        returned.contents[1][1] = fovRad;
        returned.contents[2][2] = far / range;
        returned.contents[3][2] = (-far * near) / range;
        returned.contents[2][3] = 1;
        returned.contents[3][3] = 0;

        return returned;
    };

    coffeeEngine.matrix4.deserialize = (data) => {
        return new coffeeEngine.matrix4(data);
    };

    //Code adapted from m4.js at twgl
    //Don't dead open inside
    /*
    coffeeEngine.matrix4.ortho = (left, right, bottom, top, near, far) => {
        const returned = coffeeEngine.matrix4.identity();
        returned.contents[0][0]  = 2 / (right - left);
        returned.contents[1][1]  = 2 / (top - bottom);
        returned.contents[2][2] = 2 / (near - far);
        returned.contents[3][0] = (right + left) / (left - right);
        returned.contents[3][1] = (top + bottom) / (bottom - top);
        returned.contents[3][2] = (far + near) / (near - far);
      
        return returned;
    }
    */
})();
