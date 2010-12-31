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
  
  function _openTag(tagName) {
    return "<" + tagName + ">"
  }

  function _closeTag(tagName) {
    return "</" + tagName + ">"
  }
  
  function _selfCloseTag(tagName) {
    return "<" + tagName + "/>"
  }

  function _isTag(str) {
    return str.match(/^[\s]*<.*\/>[\s]*$/)
  }
  
  function _tagFunction(tagName) {
    return function(inner) {
      var parts = []
      
      if (inner) {
        parts.push(_openTag(tagName))
        if (_isTag(inner)) parts.push("\n")
        parts.push(inner)
        parts.push(_closeTag(tagName))
        
      } else if (_include(args.nonSelfClosingTags, tagName)) {
        parts.push(_openTag(tagName))
        parts.push(_closeTag(tagName))
        
      } else {
        parts.push(_selfCloseTag(tagName))
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
