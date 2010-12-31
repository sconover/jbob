Jbob = function(providedArgs) {
  var defaults = {tags:[], nonSelfClosingTags:[]};
  var args = {};
  for (key in defaults) {
    if (providedArgs[key]) {
      args[key] = providedArgs[key];
    } else {
      args[key] = defaults[key];
    }
  }
  
  function include(arr, thing) {
    for (var i=0; i<arr.length; i++) {
      if (arr[i] == thing) {
        return true;
      }
    }
    return false;
  }
  
  function openTag(tagName, attributesStr) {
    return "<" + tagName + attributesStr + ">";
  }

  function closeTag(tagName) {
    return "</" + tagName + ">";
  }
  
  function selfCloseTag(tagName, attributesStr) {
    return "<" + tagName + attributesStr + "/>";
  }

  function isTag(str) {
    return str.replace(/\n/g, "").match(/^\s*<.*\/\w*>\s*$/);
  }
  
  function firstArgIsAttributes(args) {
    return typeof args[0] == "object" && !(args[0] instanceof Array);
  }
  
  function makeAttributesStr(attributes) {
    var attrs = [];
    for (var key in attributes) {
      attrs.push(key + "=\"" + attributes[key] + "\"");
    }    
    attrs.sort();
    
    return (attrs.length>0 ? " " : "") + attrs.join(" ");
  }
  
  function argumentsAsArray(arguments, startPos) {
    var arr = [];
    for(var i=startPos; i<arguments.length; i++) {
      arr.push(arguments[i]);
    }
    
    return arr;
  }
  
  function flattenArray(arr) {
    var newArr = [];
    for(var i=0; i<arr.length; i++) {
      var value = arr[i];
      if (value instanceof Array) {
        var innerArr = flattenArray(value);
        for(var j=0; j<innerArr.length; j++) {
          newArr.push(innerArr[j]);
        }
      } else {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }
  
  function tagFunction(tagName) {
    return function() {
      var theFirstArgIsAttributes = firstArgIsAttributes(arguments);
      var attributesStr = theFirstArgIsAttributes ? makeAttributesStr(arguments[0]) : "";
      var inners = flattenArray(argumentsAsArray(arguments, theFirstArgIsAttributes ? 1 : 0));
      
      var parts = [];
      
      if (inners.length >= 1) {
        parts.push(openTag(tagName, attributesStr));
        
        //todo: make this optional
        if (isTag(inners[0])) parts.push("\n");
        
        for(var i=0; i<inners.length; i++) {
          var inner = inners[i];
          parts.push(inner);     
        }
        
        parts.push(closeTag(tagName));
        
        //todo: cache nonclosing answers? (perf)
      } else if (include(args.nonSelfClosingTags, tagName)) {
        parts.push(openTag(tagName, attributesStr));
        parts.push(closeTag(tagName));
        
      } else {
        parts.push(selfCloseTag(tagName, attributesStr));
      }
      
      //todo: make this optional
      parts.push("\n");
      
      return parts.join("");      
    }
  }
  
  for (var i=0; i<args.tags.length; i++) {
    var tagName = args.tags[i];
    this[tagName] = tagFunction(tagName);
  }
  
  return null;
};

Jbob.htmlTags = function(target) {
  Jbob.apply(target, [{
    tags: [
      "html", "head", "body", "script", "meta", "title", "link",
      "div", "p", "span", "a", "img", "br", "hr",
      "table", "tr", "th", "td", "thead", "tbody",
      "ul", "ol", "li", 
      "dl", "dt", "dd",
      "h1", "h2", "h3", "h4", "h5", "h6", "h7",
      "form", "fieldset", "input", "textarea", "label", "button"
    ],
    
    nonSelfClosingTags:["textarea", "script"]
    
  }]);
};