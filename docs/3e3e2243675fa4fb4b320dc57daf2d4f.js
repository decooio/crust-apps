ace.define("ace/mode/jack_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],(function(e,t,n){"use strict";var i=e("../lib/oop"),r=e("./text_highlight_rules").TextHighlightRules,o=function(){this.$rules={start:[{token:"string",regex:'"',next:"string2"},{token:"string",regex:"'",next:"string1"},{token:"constant.numeric",regex:"-?0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"(?:0|[-+]?[1-9][0-9]*)\\b"},{token:"constant.binary",regex:"<[0-9A-Fa-f][0-9A-Fa-f](\\s+[0-9A-Fa-f][0-9A-Fa-f])*>"},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:"constant.language.null",regex:"null\\b"},{token:"storage.type",regex:"(?:Integer|Boolean|Null|String|Buffer|Tuple|List|Object|Function|Coroutine|Form)\\b"},{token:"keyword",regex:"(?:return|abort|vars|for|delete|in|is|escape|exec|split|and|if|elif|else|while)\\b"},{token:"language.builtin",regex:"(?:lines|source|parse|read-stream|interval|substr|parseint|write|print|range|rand|inspect|bind|i-values|i-pairs|i-map|i-filter|i-chunk|i-all\\?|i-any\\?|i-collect|i-zip|i-merge|i-each)\\b"},{token:"comment",regex:"--.*$"},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"},{token:"storage.form",regex:"@[a-z]+"},{token:"constant.other.symbol",regex:":+[a-zA-Z_]([-]?[a-zA-Z0-9_])*[?!]?"},{token:"variable",regex:"[a-zA-Z_]([-]?[a-zA-Z0-9_])*[?!]?"},{token:"keyword.operator",regex:"\\|\\||\\^\\^|&&|!=|==|<=|<|>=|>|\\+|-|\\*|\\/|\\^|\\%|\\#|\\!"},{token:"text",regex:"\\s+"}],string1:[{token:"constant.language.escape",regex:/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|['"\\\/bfnrt])/},{token:"string",regex:"[^'\\\\]+"},{token:"string",regex:"'",next:"start"},{token:"string",regex:"",next:"start"}],string2:[{token:"constant.language.escape",regex:/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|['"\\\/bfnrt])/},{token:"string",regex:'[^"\\\\]+'},{token:"string",regex:'"',next:"start"},{token:"string",regex:"",next:"start"}]}};i.inherits(o,r),t.JackHighlightRules=o})),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],(function(e,t,n){"use strict";var i=e("../range").Range,r=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t).match(/^(\s*\})/);if(!n)return 0;var r=n[1].length,o=e.findMatchingBracket({row:t,column:r});if(!o||o.row==t)return 0;var a=this.$getIndent(e.getLine(o.row));e.replace(new i(t,0,t,r-1),a)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(r.prototype),t.MatchingBraceOutdent=r})),ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],(function(e,t,n){"use strict";var i=e("../../lib/oop"),r=e("../../range").Range,o=e("./fold_mode").FoldMode,a=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};i.inherits(a,o),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var i=e.getLine(n);if(this.singleLineBlockCommentRe.test(i)&&!this.startRegionRe.test(i)&&!this.tripleStarBlockCommentRe.test(i))return"";var r=this._getFoldWidgetBase(e,t,n);return!r&&this.startRegionRe.test(i)?"start":r},this.getFoldWidgetRange=function(e,t,n,i){var r,o=e.getLine(n);if(this.startRegionRe.test(o))return this.getCommentRegionBlock(e,o,n);if(r=o.match(this.foldingStartMarker)){var a=r.index;if(r[1])return this.openingBracketBlock(e,r[1],n,a);var s=e.getCommentFoldRange(n,a+r[0].length,1);return s&&!s.isMultiLine()&&(i?s=this.getSectionRange(e,n):"all"!=t&&(s=null)),s}return"markbegin"!==t&&(r=o.match(this.foldingStopMarker))?(a=r.index+r[0].length,r[1]?this.closingBracketBlock(e,r[1],n,a):e.getCommentFoldRange(n,a,-1)):void 0},this.getSectionRange=function(e,t){for(var n=e.getLine(t),i=n.search(/\S/),o=t,a=n.length,s=t+=1,g=e.getLength();++t<g;){var c=(n=e.getLine(t)).search(/\S/);if(-1!==c){if(i>c)break;var l=this.getFoldWidgetRange(e,"all",t);if(l){if(l.start.row<=o)break;if(l.isMultiLine())t=l.end.row;else if(i==c)break}s=t}}return new r(o,a,s,e.getLine(s).length)},this.getCommentRegionBlock=function(e,t,n){for(var i=t.search(/\s*$/),o=e.getLength(),a=n,s=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,g=1;++n<o;){t=e.getLine(n);var c=s.exec(t);if(c&&(c[1]?g--:g++,!g))break}if(n>a)return new r(a,i,n,t.length)}}.call(a.prototype)})),ace.define("ace/mode/jack",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/jack_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],(function(e,t,n){"use strict";var i=e("../lib/oop"),r=e("./text").Mode,o=e("./jack_highlight_rules").JackHighlightRules,a=e("./matching_brace_outdent").MatchingBraceOutdent,s=e("./behaviour/cstyle").CstyleBehaviour,g=e("./folding/cstyle").FoldMode,c=function(){this.HighlightRules=o,this.$outdent=new a,this.$behaviour=new s,this.foldingRules=new g};i.inherits(c,r),function(){this.lineCommentStart="--",this.getNextLineIndent=function(e,t,n){var i=this.$getIndent(t);return"start"==e&&t.match(/^.*[\{\(\[]\s*$/)&&(i+=n),i},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/jack"}.call(c.prototype),t.Mode=c})),ace.require(["ace/mode/jack"],(function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)}));