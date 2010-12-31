Jbob = function(providedArgs) {
  var defaults = {tags:[], nonSelfClosingTags:[]}
  var args = {}
  for (key in defaults) {
    if (providedArgs[key]) {
      args[key] = providedArgs[key]
    } else {
      args[key] = defaults[key]
    }
  }
  
  function _include(arr, thing) {
    for (var i=0; i<arr.length; i++) {
      if (arr[i] == thing) {
        return true
      }
    }
    return false
  }
  
  function _openTag(tagName, attributesStr) {
    return "<" + tagName + attributesStr + ">"
  }

  function _closeTag(tagName) {
    return "</" + tagName + ">"
  }
  
  function _selfCloseTag(tagName, attributesStr) {
    return "<" + tagName + attributesStr + "/>"
  }

  function _isTag(str) {
    return str.replace(/\n/g, "").match(/^\s*<.*\/\w*>\s*$/)
  }
  
  function _newline(str) {
    return str.match(/\n$/)
  }
  
  function _firstArgIsAttributes(args) {
    return typeof args[0] == "object"
  }
  
  function _attributesStr(attributes) {
    var attrs = []
    for (var key in attributes) {
      attrs.push(key + "=\"" + attributes[key] + "\"");
    }    
    attrs.sort()
    
    return (attrs.length>0 ? " " : "") + attrs.join(" ")
  }
  
  function _argumentsAsArray(arguments, startPos) {
    var arr = []
    for(var i=startPos; i<arguments.length; i++) {
      arr.push(arguments[i])
    }
    return arr
  }
  
  function _tagFunction(tagName) {
    return function() {
      var firstArgIsAttributes = _firstArgIsAttributes(arguments)
      var attributesStr = firstArgIsAttributes ? _attributesStr(arguments[0]) : ""
      var inners = _argumentsAsArray(arguments, firstArgIsAttributes ? 1 : 0)
      
      var parts = []
      
      if (inners.length >= 1) {
        parts.push(_openTag(tagName, attributesStr))
        if (_isTag(inners[0])) parts.push("\n")
        
        for(var i=0; i<inners.length; i++) {
          var inner = inners[i]
          parts.push(inner)          
        }
        
        parts.push(_closeTag(tagName))
        
      } else if (_include(args.nonSelfClosingTags, tagName)) {
        parts.push(_openTag(tagName, attributesStr))
        parts.push(_closeTag(tagName))
        
      } else {
        parts.push(_selfCloseTag(tagName, attributesStr))
      }
      
      parts.push("\n")
      
      return parts.join("")      
    }
  }
  
  for (var i=0; i<args.tags.length; i++) {
    var tagName = args.tags[i]
    this[tagName] = _tagFunction(tagName)
  }
  
}


// render: function(lpad) {
//   lpad = lpad || 0;
//   
//   var node      = [],
//       attrs     = [],
//       textnode  = (this instanceof Jaml.TextNode),
//       multiline = this.multiLineTag();
//   
//   
//   //add any left padding
//   if (!textnode) node.push(this.getPadding(lpad));
//   
//   //open the tag
//   node.push("<" + this.tagName);
// 
//   for (var key in this.attributes) {
//     attrs.push(key + "=\"" + this.attributes[key] + "\"");
//   }    
//   attrs.sort()
//   //add any tag attributes
//   for (var i=0; i<attrs.length; i++) {
//     node.push(" " + attrs[i]);
//   }
//   
//   if (this.isSelfClosing() && this.children.length==0) {
//     node.push("/>\n");
//   } else {
//     node.push(">");
//     
//     if (multiline) node.push("\n");
//     
//     this.renderChildren(node, this.children, lpad);
//           
//     if (multiline) node.push(this.getPadding(lpad));
//     node.push("</", this.tagName, ">\n");
//   }
//   
//   return node.join("");
// },
