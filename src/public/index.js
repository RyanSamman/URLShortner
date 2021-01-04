var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Change URL if putting Backend/Frontend on seperate URLS
var backendURL = "";
var formElement = document.querySelector("#createform");
var urlInputElement = document.querySelector("#js-url");
var shortenedInputElement = document.querySelector("#js-shortened");
var URLOutputDivElement = document.querySelector("#output");
formElement.onsubmit = function (ev) { return __awaiter(_this, void 0, void 0, function () {
    var url, shortened, response, _a, _b, data, shortenedURL;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                // Stop form from submitting normally
                ev.preventDefault();
                url = urlInputElement.value;
                shortened = shortenedInputElement.value;
                return [4 /*yield*/, fetch("/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ url: url, shortened: shortened })
                    })];
            case 1:
                response = _c.sent();
                console.log(response);
                if (!(response.status !== 201)) return [3 /*break*/, 3];
                _a = alert;
                _b = response.status + " Error! ";
                return [4 /*yield*/, response.text()];
            case 2:
                _a.apply(void 0, [_b + (_c.sent())]);
                return [2 /*return*/];
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _c.sent();
                shortenedURL = window.location.href + data.shortened;
                alert("Your Shortened URL is " + shortenedURL);
                repopulateOutput();
                return [2 /*return*/];
        }
    });
}); };
function repopulateOutput() {
    return __awaiter(this, void 0, void 0, function () {
        var response, _a, _b, data;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fetch(backendURL + "/all")];
                case 1:
                    response = _c.sent();
                    if (!(response.status !== 200)) return [3 /*break*/, 3];
                    _a = alert;
                    _b = response.status + " Error! ";
                    return [4 /*yield*/, response.text()];
                case 2:
                    _a.apply(void 0, [_b + (_c.sent())]);
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _c.sent();
                    URLOutputDivElement.innerHTML = "";
                    data.map(function (d) { return dataToHTML(d); })
                        .forEach(function (c) { return URLOutputDivElement.appendChild(c); });
                    return [2 /*return*/];
            }
        });
    });
}
function dataToHTML(data) {
    var template = document.createElement("template");
    template.innerHTML = ("\n\t\t<div>\n\t\t\t<a target=\"_blank\" data-test=\"abc\" href=\"#\"></a>\n\t\t\t<a target=\"_blank\" href=\"#\"></a>\n\t\t\t<button>Copy URL</button>\n\t\t</div>\n\t");
    var newNode = template.content.firstElementChild;
    var realURLElement = newNode.children[0];
    var shortenedURLElement = newNode.children[1];
    var buttonElement = newNode.children[2];
    var shortenedURL = (backendURL || window.location.href) + data.shortened;
    realURLElement.innerText = data.url;
    realURLElement.href = data.url;
    shortenedURLElement.innerText = data.shortened;
    shortenedURLElement.href = shortenedURL;
    buttonElement.onclick = function () { return navigator.clipboard.writeText(shortenedURL)
        .then(function () { return alert(shortenedURL + " Added to clipboard"); })["catch"](function () { return alert("Failed to copy to clipboard"); }); };
    return newNode;
}
window.onload = repopulateOutput;
