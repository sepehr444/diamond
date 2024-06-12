var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// the mode property is beta and now but it is better to be custom
export default function Game(canvasId, mode = ["Custom"]) {
    const getCanvasElementById = () => {
        const canvas = document.getElementById(canvasId);
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error(`The element of id "${canvasId}" is not a HTMLCanvasElement. Make sure a <canvas id="${canvasId}""> element is present in the document.`);
        }
        return canvas;
    };
    const getCanvasRenderingContext2D = (canvas) => {
        const context = canvas.getContext("2d");
        if (context === null) {
            throw new Error("This browser does not support 2-dimensional canvas rendering contexts.");
        }
        return context;
    };
    const canvas = getCanvasElementById();
    const ctx = getCanvasRenderingContext2D(canvas);
    function drawObject(object) {
        let { src, width, filter, height, position, sheight, swidth, sposition } = object;
        if (src) {
            !height && (height = 20);
            !width && (width = 20);
            !position && (position = { x: 0, y: 0 });
            let { x, y } = position;
            let img = new Image();
            img.src = src;
            filter && (ctx.filter = filter);
            ctx.imageSmoothingQuality = "high";
            if (sheight && swidth && sposition) {
                ctx.drawImage(img, sposition.sx, sposition.sy, swidth, sheight, x, y, width, height);
            }
            else {
                ctx.drawImage(img, x, y, width, height);
            }
        }
        else if (src != "") {
            console.log("this src is not avaible : " + src);
        }
    }
    function loop(frame, isRequestAnimationFrameOff) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame();
        if (!isRequestAnimationFrameOff) {
            window.requestAnimationFrame(function () {
                loop(frame);
            });
        }
    }
    class GameObject {
        isTouch(object) {
            var _a, _b, _c, _d;
            let x = (_a = this.position) === null || _a === void 0 ? void 0 : _a.x;
            let y = (_b = this.position) === null || _b === void 0 ? void 0 : _b.y;
            let objectX = (_c = object.position) === null || _c === void 0 ? void 0 : _c.x;
            let objectY = (_d = object.position) === null || _d === void 0 ? void 0 : _d.y;
            if (objectX &&
                objectY &&
                x &&
                y &&
                this.width &&
                object.width &&
                this.height &&
                object.height) {
                if (x + this.width >= objectX &&
                    x <= objectX + object.width &&
                    y + this.height >= objectY &&
                    y <= objectY + object.height) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        remove() {
            this.filter = "";
            this.src = "";
            this.height = 0;
            this.width = 0;
            this.sheight = 0;
            this.sposition = { sx: 0, sy: 0 };
            this.swidth = 0;
            this.position = { x: 0, y: 0 };
            this.isTouch = () => false;
            this.remove = () => { };
        }
        constructor(_a) {
            var _b, _c, _d, _e;
            var { src = "", width = 20, height = 20, position = { x: 0, y: 0 }, filter = "", sposition, swidth, sheight } = _a, objectProperty = __rest(_a, ["src", "width", "height", "position", "filter", "sposition", "swidth", "sheight"]);
            Object.assign(this, objectProperty);
            this.src = src;
            this.width = width;
            this.height = height;
            this.position = position;
            this.filter = filter;
            this.sheight = sheight;
            this.swidth = swidth;
            this.sposition = sposition;
            this._defaultValues = {
                src: src !== null && src !== void 0 ? src : "",
                width: (_b = this.width) !== null && _b !== void 0 ? _b : 0,
                height: (_c = this.height) !== null && _c !== void 0 ? _c : 0,
                position: (_d = this.position) !== null && _d !== void 0 ? _d : { x: 0, y: 0 },
                filter: (_e = this.filter) !== null && _e !== void 0 ? _e : "",
                sheight: this.sheight,
                swidth: this.swidth,
                sposition: this.sposition,
                isTouch: this.isTouch,
            };
        }
        get defaultValues() {
            return this._defaultValues;
        }
    }
    class Controller {
        constructor(controller = Controller._defaultController) {
            this.controller = controller;
        }
    }
    Controller._defaultController = {
        keydown: (e, object) => {
            switch (e.code) {
                case "KeyD":
                    object.position.x += 2;
                    break;
                case "KeyA":
                    object.position.x -= 2;
                    break;
                case "KeyW":
                    object.position.y -= 2;
                    break;
                case "KeyS":
                    object.position.y += 2;
                    break;
            }
        },
    };
    function backInside(object) {
        if (object) {
            if (object.position.x > canvas.width) {
                object.position.x = -object.width;
            }
            if (object.position.x < -object.width) {
                object.position.x = canvas.width;
            }
            if (object.position.y > canvas.height) {
                object.position.y = -object.height;
            }
            if (object.position.y < -object.height) {
                object.position.y = canvas.height;
            }
        }
    }
    function Movement(object, controller = new Controller().controller) {
        var _a;
        let element = document;
        (_a = Object.values(controller)) === null || _a === void 0 ? void 0 : _a.map((c, i) => {
            let e = Object.keys(controller)[i];
            element.addEventListener(e, (ev) => {
                c(ev, object);
            });
        });
        function removeMove() {
            element.removeEventListener("keydown", () => { });
            element.removeEventListener("keyup", () => { });
        }
        return { removeMove };
    }
    function test() {
        if (canvas) {
            if (ctx) {
                canvas.style.backgroundColor = "rgb(80,80,180)";
                let player = new GameObject({
                    src: "https://static.vecteezy.com/system/resources/previews/034/618/167/large_2x/3d-cute-kid-character-in-confident-pose-hand-on-hip-free-png.png",
                    width: 60,
                    height: 70,
                    position: { x: 0, y: 0 },
                });
                let diamond = new GameObject({
                    src: "https://static.vecteezy.com/system/resources/thumbnails/008/513/899/small_2x/blue-diamond-illustration-png.png",
                    width: 25,
                    height: 20,
                    position: { x: canvas.width - 30, y: canvas.height - 30 },
                });
                let dir = {
                    x: 0,
                    y: 0,
                };
                // let controller = new Controller([
                //   {
                //     keys: ["KeyD"],
                //     keyDown: (object, speed) => {
                //       dir.x = speed;
                //     },
                //     keyUp: (object) => {
                //       dir.x = 0;
                //     },
                //   },
                //   {
                //     keys: ["KeyA"],
                //     keyDown: (object, speed) => {
                //       dir.x = -speed;
                //     },
                //     keyUp: (object) => {
                //       dir.x = 0;
                //     },
                //   },
                //   {
                //     keys: ["KeyW"],
                //     keyDown: (object, speed) => {
                //       dir.y = -speed;
                //     },
                //     keyUp: (object) => {
                //       dir.y = 0;
                //     },
                //   },
                //   {
                //     keys: ["KeyS"],
                //     keyDown: (object, speed) => {
                //       dir.y = speed;
                //     },
                //     keyUp: (object) => {
                //       dir.y = 0;
                //     },
                //   },
                // ]).controller;
                let movement = Movement(player);
                loop(() => {
                    backInside(player);
                    drawObject(player);
                    drawObject(diamond);
                    if (player.isTouch(diamond)) {
                        dir = { x: 0, y: 0 };
                        diamond.remove();
                        player.position = player.defaultValues.position;
                        player.src =
                            "https://static.vecteezy.com/system/resources/previews/034/618/186/non_2x/3d-kid-character-give-a-thumb-up-with-cute-happy-face-free-png.png";
                        alert("you win");
                    }
                    player.position.x += dir.x;
                    player.position.y += dir.y;
                });
            }
            else {
                throw Error("This browser does not support 2-dimensional canvas render contexts.");
            }
        }
        else {
            throw Error("canvas not found");
        }
    }
    function Gravity(objects, gravity = 10, fn) {
        if (fn) {
            fn();
        }
        else {
            objects.map((object) => {
                if (object.position.y <= canvas.height - object.height) {
                    object.position.y += gravity / 10;
                }
            });
        }
    }
    let gameOutPut = {
        loop,
        Gravity,
        canvas,
        ctx,
        drawObject,
        test,
        GameObject,
        Controller,
        Movement,
        backInside,
    };
    mode.map((m, i) => {
        switch (m) {
            case "NoMove":
                delete gameOutPut.Movement;
                break;
            case "NoTest":
                delete gameOutPut.test;
                break;
            case "NoLoop":
                delete gameOutPut.loop;
                break;
            case "NoCorner":
                delete gameOutPut.backInside;
                break;
            case "NoJump":
                delete gameOutPut.DefaultJump;
                break;
        }
    });
    return gameOutPut;
}
