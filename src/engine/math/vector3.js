(function() {
    coffeeEngine.vector3 = class {
        constructor(x,y,z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        add(b) {
            return new coffeeEngine.vector3(this.x + b.x, this.y + b.y, this.z + b.z);
        }

        sub(b) {
            return new coffeeEngine.vector3(this.x - b.x, this.y - b.y, this.z - b.z);
        }

        mul(b) {
            return new coffeeEngine.vector3(this.x * b.x, this.y * b.y, this.z * b.z);
        }

        div(b) {
            return new coffeeEngine.vector3(this.x / b.x, this.y / b.y, this.z / b.z);
        }

        length() {
            return Math.sqrt(this.lengthSquared());
        }

        lengthSquared() {
            return Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2);
        }

        normalize() {
            const length = this.length();
            return this.div({x:length, y:length, z:length});
        }

        dot(b) {
            return this.mul(b).normalize();
        }

        cross() {
            return new coffeeEngine.vector3(
                this.y*b.z - this.z*b.y,
                this.z*b.x - this.x*b.z,
                this.x*b.y - this.y*b.x
            );
        }

        rotate(yaw,pitch,roll) {
            const returned = new coffeeEngine.vector3(
                this.z * Math.sin(yaw) + this.x * Math.cos(yaw),
                this.y,
                this.z * Math.cos(yaw) - this.x * Math.sin(yaw)
            );
            
            returned.y = returned.z * Math.sin(pitch) + returned.y * Math.cos(pitch);
            returned.z = returned.z * Math.cos(pitch) - returned.y * Math.sin(pitch);
            
            returned.x = returned.y * Math.sin(roll) + returned.x * Math.cos(roll);
            returned.y = returned.y * Math.cos(roll) - returned.x * Math.sin(roll);

            return returned;
        }

        webGLValue() {
            return [this.x,this.y,this.z];
        }
    }
})();