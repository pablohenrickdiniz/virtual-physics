/*
 *The MIT License (MIT)
 *
 *Copyright (c) 2013 Hubert Eichner
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy
 *of this software and associated documentation files (the "Software"), to deal
 *in the Software without restriction, including without limitation the rights
 *to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *copies of the Software, and to permit persons to whom the Software is
 *furnished to do so, subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in
 *all copies or substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *THE SOFTWARE.
 */

(function(w){
    w.MV =  {
        dot: function (x, y) { //dot product
            return x.reduce(function (p, c, i) {
                return p + x[i] * y[i];
            }, 0);
        },
        VxV: function (x, y) { //element-wise product
            return x.map(function (xElem, i) {
                return xElem * y[i];
            });
        },
        VdV: function (x, y) { //element-wise division
            return x.map(function (xElem, i) {
                return xElem / y[i];
            });
        },
        VpV: function (x, y) { //element-wise addition
            return x.map(function (xElem, i) {
                return xElem + y[i];
            });
        },
        VmV: function (x, y) { //element-wise subtraction
            return x.map(function (xElem, i) {
                return xElem - y[i];
            });
        },
        SxV: function (c, x) { //scalar-vector multiplication
            return x.map(function (xElem) {
                return c * xElem;
            });
        },
        MxV: function (M, x) { //matrix-vector multiplication

            return M.map(function (mElem) {
                return MV.dot(mElem, x);
            });
        },
        transpose: function (x) { //matrix/vector transpose
            if (x.length > 0 && !Array.isArray(x[0])) return x;
            var n = x[0].length;
            var r = [];
            var dim;
            for (dim = 0; dim < n; dim++) {
                r[dim] = x.map(function (xElem) {
                    return xElem[dim];
                });
            }
            return r;
        },
        cross2: function (x, y) {
            return x[0] * y[1] - x[1] * y[0];
        },
        norm: function (x) { //2-norm of a vector
            return Math.sqrt(MV.dot(x, x));
        },
        normalize: function (x) { //normalize a vector
            return MV.SxV(1 / MV.norm(x), x);
        },
        min: function (x, dim) { // min of vector (or matrix along dimension dim)
            if (dim === undefined) {
                return x.reduce(function (p, c) {
                    return p < c ? p : c;
                });
            } else {
                return x.reduce(function (p, c) {
                    return (p[dim] < c[dim]) ? p : c;
                })[dim];
            }
        },
        med: function (va, vb) {
            return [(va[0] + vb[0]) / 2, (va[1] + vb[1]) / 2];
        },
        max: function (x, dim) { // max of vector (or matrix along dimension dim)
            if (dim === undefined) {
                return x.reduce(function (p, c) {
                    return p > c ? p : c;
                });
            } else {
                return x.reduce(function (p, c) {
                    return (p[dim] > c[dim]) ? p : c;
                })[dim];
            }
        },
        minIndex: function (x, dim) {
            if (dim === undefined) {
                return x.reduce(function (p, c, i, arr) {
                    return (arr[i] < arr[p]) ? i : p;
                }, 0);
            } else {
                return x.reduce(function (p, c, i, arr) {
                    return (arr[i][dim] < arr[p][dim]) ? i : p;
                }, 0);
            }
        },
        rotate: function (vertice, theta, center) {
            var rad = MV.toRadians(theta);
            center = center == undefined ? [0, 0] : center;
            var cx = center[0];
            var cy = center[1];
            var vx = vertice[0];
            var vy = vertice[1];
            var radc = Math.cos(rad);
            var rads = Math.sin(rad);
            var suba = vx - cx;
            var subb = vy - cy;
            return [(suba * radc - subb * rads) + cx, (subb * radc + suba * rads) + cy];
        },
        toRadians: function (theta) {
            return theta * (Math.PI / 180);
        },
        getDegree: function (va, vb) {
            return MV.toDegree(MV.getRadians(va, vb));
        },
        getRadians: function (va, vb) {
            var pe = MV.dot(va, vb);
            var na = MV.norm(va);
            var nb = MV.norm(vb);
            var round = pe / (na * nb);

            //if(isNaN(round)){
            //    console.log('fail');
            //    console.log('va:',va);
            //    console.log('vb:',vb);
            //    console.log('pe:',pe);
            //    console.log('na:',na);
            //    console.log('nb:',nb);
            //}

            return Math.acos(round);
        },
        toDegree: function (theta) {
            return theta * (180 / Math.PI);
        },
        toInt: function (px) {
            return parseInt(px.substr(0, px.indexOf('px')));
        },
        distance: function (pa, pb) {
            return Math.sqrt(Math.pow(pa[0] - pb[0], 2) + Math.pow(pa[1] - pb[1], 2));
        },
        intersectPoint: function (b, e, c, a) {
            var d = c[0] - a[0], f = b[0] - e[0], g = c[1] - a[1], h = b[1] - e[1];
            b = b[0] * e[1] - b[1] * e[0];
            c = c[0] * a[1] - c[1] * a[0];
            a = f * g - h * d;
            d = b * d - f * c;
            return 0 == a || 0 == d ? null : [d / a, (b * g - h * c) / a];
        }
    };
})(window);

