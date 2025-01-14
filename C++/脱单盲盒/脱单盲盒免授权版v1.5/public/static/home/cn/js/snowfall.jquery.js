(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
} ()); (function($) {
    $.snowfall = function(element, options) {
        var defaults = {
                flakeCount: 35,
                flakeColor: '#ffffff',
                flakePosition: 'absolute',
                flakeIndex: 999999,
                minSize: 1,
                maxSize: 2,
                minSpeed: 1,
                maxSpeed: 5,
                round: false,
                shadow: false,
                collection: false,
                collectionHeight: 40,
                deviceorientation: false
            },
            options = $.extend(defaults, options),
            random = function random(min, max) {
                return Math.round(min + Math.random() * (max - min));
            };
        $(element).data("snowfall", this);
        function Flake(_x, _y, _size, _speed, _id) {
            this.id = _id;
            this.x = _x;
            this.y = _y;
            this.size = _size;
            this.speed = _speed;
            this.step = 0;
            this.stepSize = random(1, 10) / 100;
            if (options.collection) {
                this.target = canvasCollection[random(0, canvasCollection.length - 1)];
            }
            var flakeMarkup = null;
            if (options.image) {
                flakeMarkup = $(document.createElement("img"));
                flakeMarkup[0].src = options.image;
            } else {
                flakeMarkup = $(document.createElement("div"));
                flakeMarkup.css({
                    'background': options.flakeColor
                });
            }
            flakeMarkup.attr({
                'class': 'snowfall-flakes',
                'id': 'flake-' + this.id
            }).css({
                'width': this.size,
                'height': this.size,
                'position': options.flakePosition,
                'top': this.y,
                'left': this.x,
                'fontSize': 0,
                'zIndex': options.flakeIndex
            });
            if ($(element).get(0).tagName === $(document).get(0).tagName) {
                $('body').append(flakeMarkup);
                element = $('body');
            } else {
                $(element).append(flakeMarkup);
            }
            this.element = document.getElementById('flake-' + this.id);
            this.update = function() {
                this.y += this.speed;
                if (this.y > (elHeight) - (this.size + 6)) {
                    this.reset();
                }
                this.element.style.top = this.y + 'px';
                this.element.style.left = this.x + 'px';
                this.step += this.stepSize;
                if (doRatio === false) {
                    this.x += Math.cos(this.step);
                } else {
                    this.x += (doRatio + Math.cos(this.step));
                }
                if (options.collection) {
                    if (this.x > this.target.x && this.x < this.target.width + this.target.x && this.y > this.target.y && this.y < this.target.height + this.target.y) {
                        var ctx = this.target.element.getContext("2d"),
                            curX = this.x - this.target.x,
                            curY = this.y - this.target.y,
                            colData = this.target.colData;
                        if (colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] !== undefined || curY + this.speed + this.size > this.target.height) {
                            if (curY + this.speed + this.size > this.target.height) {
                                while (curY + this.speed + this.size > this.target.height && this.speed > 0) {
                                    this.speed *= .5;
                                }
                                ctx.fillStyle = "#fff";
                                if (colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] == undefined) {
                                    colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] = 1;
                                    ctx.fillRect(curX, (curY) + this.speed + this.size, this.size, this.size);
                                } else {
                                    colData[parseInt(curX)][parseInt(curY + this.speed)] = 1;
                                    ctx.fillRect(curX, curY + this.speed, this.size, this.size);
                                }
                                this.reset();
                            } else {
                                this.speed = 1;
                                this.stepSize = 0;
                                if (parseInt(curX) + 1 < this.target.width && colData[parseInt(curX) + 1][parseInt(curY) + 1] == undefined) {
                                    this.x++;
                                } else if (parseInt(curX) - 1 > 0 && colData[parseInt(curX) - 1][parseInt(curY) + 1] == undefined) {
                                    this.x--;
                                } else {
                                    ctx.fillStyle = "#fff";
                                    ctx.fillRect(curX, curY, this.size, this.size);
                                    colData[parseInt(curX)][parseInt(curY)] = 1;
                                    this.reset();
                                }
                            }
                        }
                    }
                }
                if (this.x > (elWidth) - widthOffset || this.x < widthOffset) {
                    this.reset();
                }
            }
            this.reset = function() {
                this.y = 0;
                this.x = random(widthOffset, elWidth - widthOffset);
                this.stepSize = random(1, 10) / 100;
                this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
                this.speed = random(options.minSpeed, options.maxSpeed);
            }
        } //绱犳潗瀹跺洯 - www.sucaijiayuan.com
        var flakes = [],
            flakeId = 0,
            i = 0,
            elHeight = $(element).height(),
            elWidth = $(element).width(),
            widthOffset = 0,
            snowTimeout = 0;
        if (options.collection !== false) {
            var testElem = document.createElement('canvas');
            if ( !! (testElem.getContext && testElem.getContext('2d'))) {
                var canvasCollection = [],
                    elements = $(options.collection),
                    collectionHeight = options.collectionHeight;
                for (var i = 0; i < elements.length; i++) {
                    var bounds = elements[i].getBoundingClientRect(),
                        canvas = document.createElement('canvas'),
                        collisionData = [];
                    if (bounds.top - collectionHeight > 0) {
                        document.body.appendChild(canvas);
                        canvas.style.position = options.flakePosition;
                        canvas.height = collectionHeight;
                        canvas.width = bounds.width;
                        canvas.style.left = bounds.left + 'px';
                        canvas.style.top = bounds.top - collectionHeight + 'px';
                        for (var w = 0; w < bounds.width; w++) {
                            collisionData[w] = [];
                        }
                        canvasCollection.push({
                            element: canvas,
                            x: bounds.left,
                            y: bounds.top - collectionHeight,
                            width: bounds.width,
                            height: collectionHeight,
                            colData: collisionData
                        });
                    }
                }
            } else {
                options.collection = false;
            }
        }
        if ($(element).get(0).tagName === $(document).get(0).tagName) {
            widthOffset = 25;
        }
        $(window).bind("resize",
            function() {
                elHeight = $(element)[0].clientHeight;
                elWidth = $(element)[0].offsetWidth;
            });
        for (i = 0; i < options.flakeCount; i += 1) {
            flakeId = flakes.length;
            flakes.push(new Flake(random(widthOffset, elWidth - widthOffset), random(0, elHeight), random((options.minSize * 100), (options.maxSize * 100)) / 100, random(options.minSpeed, options.maxSpeed), flakeId));
        }
        if (options.round) {
            $('.snowfall-flakes').css({
                '-moz-border-radius': options.maxSize,
                '-webkit-border-radius': options.maxSize,
                'border-radius': options.maxSize
            });
        }
        if (options.shadow) {
            $('.snowfall-flakes').css({
                '-moz-box-shadow': '1px 1px 1px #555',
                '-webkit-box-shadow': '1px 1px 1px #555',
                'box-shadow': '1px 1px 1px #555'
            });
        }
        var doRatio = false;
        if (options.deviceorientation) {
            $(window).bind('deviceorientation',
                function(event) {
                    doRatio = event.originalEvent.gamma * 0.1;
                });
        }
        function snow() {
            for (i = 0; i < flakes.length; i += 1) {
                flakes[i].update();
            }
            snowTimeout = requestAnimationFrame(function() {
                snow()
            });
        }
        snow();
        this.clear = function() {
            $(element).children('.snowfall-flakes').remove();
            flakes = [];
            cancelAnimationFrame(snowTimeout);
        }
    };
    $.fn.snowfall = function(options) {
        if (typeof(options) == "object" || options == undefined) {
            return this.each(function(i) { (new $.snowfall(this, options));
            });
        } else if (typeof(options) == "string") {
            return this.each(function(i) {
                var snow = $(this).data('snowfall');
                if (snow) {
                    snow.clear();
                }
            });
        }
    };
})(jQuery);