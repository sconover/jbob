require("./spec_helper.js");

describe("Jbob: nodes", function() {
  
  beforeEach(function(){
    _ = {}
    Jbob.apply(_, [{tags:["fooBar", "x", "y", "z", "J", "K", "iDontSelfClose"], 
                    nonSelfClosingTags:["iDontSelfClose"]}])
  });
  
  describe("tag closing", function() {
    it("self-closes by default", function(){
      expect(_.fooBar()).
     toEqual("<fooBar/>\n");
    });

    it("doesn't self-close for non self closing tags", function(){
      expect(_.iDontSelfClose()).
     toEqual("<iDontSelfClose></iDontSelfClose>\n");
    });
    
    it("doesn't self-close if there are children.", function(){
      expect(_.fooBar(_.x())).
     toEqual("<fooBar>\n" +
             "<x/>\n" +
             "</fooBar>\n");
    });
    
    it("doesn't self-close if there are text nodes", function(){
      expect(_.fooBar("x")).
     toEqual("<fooBar>x</fooBar>\n");
    });
    
  });
  
  
  describe("attributes", function() {
    it("renders attributes as key value pairs separated by = in the tag", function(){
      expect(_.fooBar({a:"b"})).
     toEqual("<fooBar a=\"b\"/>\n");
    });
  
    it("renders several attributes in a row.  order is imposed", function(){
      expect(_.fooBar({x:"y", a:"b", c:"d"})).
     toEqual("<fooBar a=\"b\" c=\"d\" x=\"y\"/>\n");
    });
  
    it("renders booleans", function(){
      expect(_.fooBar({a:true})).toEqual("<fooBar a=\"true\"/>\n");
      expect(_.fooBar({a:false})).toEqual("<fooBar a=\"false\"/>\n");
    });
      
    it("renders integers", function(){
      expect(_.fooBar({a:0})).toEqual("<fooBar a=\"0\"/>\n");
      expect(_.fooBar({a:-1})).toEqual("<fooBar a=\"-1\"/>\n");
      expect(_.fooBar({a:7})).toEqual("<fooBar a=\"7\"/>\n");
    });
    
    it("renders floats", function(){
      expect(_.fooBar({a:0.0})).toEqual("<fooBar a=\"0\"/>\n");

      expect(_.fooBar({a:0.01})).toEqual("<fooBar a=\"0.01\"/>\n");
      expect(_.fooBar({a:0.0100})).toEqual("<fooBar a=\"0.01\"/>\n");

      expect(_.fooBar({a:23.45})).toEqual("<fooBar a=\"23.45\"/>\n");
      expect(_.fooBar({a:-23.45})).toEqual("<fooBar a=\"-23.45\"/>\n");
    });
    
    it("does the javascript thing on really big and really small numbers.  just calling this out.", function(){
      expect(_.fooBar({a:70000000000000000000000})).toEqual("<fooBar a=\"7e+22\"/>\n");
      expect(_.fooBar({a:70000000000000000000000.01})).toEqual("<fooBar a=\"7e+22\"/>\n");

      expect(_.fooBar({a:0.00000000000000000000007})).toEqual("<fooBar a=\"7e-23\"/>\n");
    });
    
    //todo: throw if the attribute value is a non-primitive?
  });
  
  describe("element children", function() {
    it("renders children as inner tags", function(){
      expect(_.fooBar(_.x())).
     toEqual("<fooBar>\n" +
               "<x/>\n" +
             "</fooBar>\n");
    });
  
    it("renders multiple children in order", function(){
      expect(_.fooBar(_.x(), _.y(), _.z())).
     toEqual("<fooBar>\n" +
               "<x/>\n" +
               "<y/>\n" +
               "<z/>\n" +
             "</fooBar>\n");
    });
  
    it("renders children of children", function(){
      expect(_.fooBar(
               _.x(_.J()), 
               _.y(_.K())
             )).
     toEqual("<fooBar>\n" +
               "<x>\n" +
                 "<J/>\n" +
               "</x>\n" +
               "<y>\n" +
                 "<K/>\n" +
               "</y>\n" +
             "</fooBar>\n");
    });
  });
  // 
  // describe("array children", function() {
  //   it("renders an array of nodes as a series of child nodes.  " +
  //      "this is often useful when you want to $.map or _.map an array of objects into the equivalent array of nodes.", function(){
  //     expect(fooBar.addChild([new Jaml.Node("x"), new Jaml.Node("y")]).
  //                   addChild(new Jaml.Node("z")).render()).
  //    toEqual("<fooBar>\n" +
  //            "  <x/>\n" +
  //            "  <y/>\n" +
  //            "  <z/>\n" +
  //            "</fooBar>\n");
  //   });    
  // 
  //   it("works with mixed node and textnodes", function(){
  //     expect(fooBar.addChild([new Jaml.Node("x"), new Jaml.TextNode("y")]).
  //                   addChild(new Jaml.TextNode("z")).render()).
  //    toEqual("<fooBar>\n" +
  //            "  <x/>\n" +
  //            "yz</fooBar>\n");
  //   });    
  // 
  //   it("renders arrays of arrays too", function(){
  //      expect(fooBar.addChild([[new Jaml.Node("x"), [new Jaml.Node("y")]]]).
  //                    addChild(new Jaml.Node("z")).render()).
  //     toEqual("<fooBar>\n" +
  //             "  <x/>\n" +
  //             "  <y/>\n" +
  //             "  <z/>\n" +
  //             "</fooBar>\n");
  //   });    
  // 
  //   it("renders children of children in arrays properly", function(){
  //     expect(fooBar.addChild([[new Jaml.Node("x").addChild(new Jaml.Node("J")), 
  //                             [new Jaml.Node("y").addChild(new Jaml.Node("K"))]]]).
  //                   addChild(new Jaml.Node("z")).render()).
  //    toEqual("<fooBar>\n" +
  //            "  <x>\n" +
  //            "    <J/>\n" +
  //            "  </x>\n" +
  //            "  <y>\n" +
  //            "    <K/>\n" +
  //            "  </y>\n" +
  //            "  <z/>\n" +
  //            "</fooBar>\n");
  //   });    
  // 
  //   it("renders array children, plus attributes, properly (bug)", function(){
  //     expect(fooBar.setAttributes({x:"y"}).
  //                   addChild([new Jaml.Node("x"), new Jaml.Node("y")]).render()).
  //    toEqual("<fooBar x=\"y\">\n" +
  //            "  <x/>\n" +
  //            "  <y/>\n" +
  //            "</fooBar>\n");
  //   });    
  // 
  // })
  // 
  // describe("textnode children", function() {
  //   it("renders", function(){
  //     expect(new Jaml.TextNode("x").render()).
  //    toEqual("x");
  //   });
  // 
  //   it("renders a single textnode child all on one line", function(){
  //     expect(new Jaml.Node("fooBar").addChild(new Jaml.TextNode("x")).render()).
  //    toEqual("<fooBar>x</fooBar>\n");
  //   });
  // 
  //   it("renders text nodes in one line, on a new line if there are multiple textnode children", function(){
  //     expect(fooBar.addChild(new Jaml.TextNode("x")).
  //                   addChild(new Jaml.TextNode("y")).render()).
  //    toEqual("<fooBar>\nxy</fooBar>\n");
  //   });
  // });
});

