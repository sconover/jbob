require("./spec_helper.js");

describe("Jbob: nodes", function() {
  
  beforeEach(function(){
    _ = {}
    Jbob.apply(_, [{tags:["fooBar", "x", "y", "z", "J", "K", "iDontSelfClose"], 
                    nonSelfClosingTags:["iDontSelfClose"],
                    attributeMappings:{"iDontCauseProblems":"iCauseProblemsInJsButNotInBuilderOutput"}
                   }])
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
  
    //todo: throw if the attribute value is a non-primitive?
  });
  
  describe("values", function(){
    it("renders booleans", function(){
      expect(_.fooBar({a:true})).toEqual("<fooBar a=\"true\"/>\n");
      expect(_.fooBar({a:false})).toEqual("<fooBar a=\"false\"/>\n");
      
      expect(_.fooBar(true)).toEqual("<fooBar>true</fooBar>\n");
      expect(_.fooBar(false)).toEqual("<fooBar>false</fooBar>\n");
    });
      
    it("renders integers", function(){
      expect(_.fooBar({a:0})).toEqual("<fooBar a=\"0\"/>\n");
      expect(_.fooBar({a:-1})).toEqual("<fooBar a=\"-1\"/>\n");
      expect(_.fooBar({a:7})).toEqual("<fooBar a=\"7\"/>\n");

      expect(_.fooBar(0)).toEqual("<fooBar>0</fooBar>\n");
      expect(_.fooBar(-1)).toEqual("<fooBar>-1</fooBar>\n");
      expect(_.fooBar(7)).toEqual("<fooBar>7</fooBar>\n");
    });
    
    it("renders floats", function(){
      expect(_.fooBar({a:0.0})).toEqual("<fooBar a=\"0\"/>\n");

      expect(_.fooBar({a:0.01})).toEqual("<fooBar a=\"0.01\"/>\n");
      expect(_.fooBar({a:0.0100})).toEqual("<fooBar a=\"0.01\"/>\n");

      expect(_.fooBar({a:23.45})).toEqual("<fooBar a=\"23.45\"/>\n");
      expect(_.fooBar({a:-23.45})).toEqual("<fooBar a=\"-23.45\"/>\n");


      expect(_.fooBar(0.0)).toEqual("<fooBar>0</fooBar>\n");
      
      expect(_.fooBar(0.01)).toEqual("<fooBar>0.01</fooBar>\n");
      expect(_.fooBar(0.0100)).toEqual("<fooBar>0.01</fooBar>\n");
      
      expect(_.fooBar(23.45)).toEqual("<fooBar>23.45</fooBar>\n");
      expect(_.fooBar(-23.45)).toEqual("<fooBar>-23.45</fooBar>\n");
    });
    
    it("does the javascript thing on really big and really small numbers.  just calling this out.", function(){
      expect(_.fooBar({a:70000000000000000000000})).toEqual("<fooBar a=\"7e+22\"/>\n");
      expect(_.fooBar({a:70000000000000000000000.01})).toEqual("<fooBar a=\"7e+22\"/>\n");

      expect(_.fooBar({a:0.00000000000000000000007})).toEqual("<fooBar a=\"7e-23\"/>\n");



      expect(_.fooBar(70000000000000000000000)).toEqual("<fooBar>7e+22</fooBar>\n");
      expect(_.fooBar(70000000000000000000000.01)).toEqual("<fooBar>7e+22</fooBar>\n");
      
      expect(_.fooBar(0.00000000000000000000007)).toEqual("<fooBar>7e-23</fooBar>\n");
    });
    
    it("renders null and undefined as blank, or nothing", function(){
      expect(_.fooBar({a:null})).toEqual("<fooBar a=\"\"/>\n");
      expect(_.fooBar({a:undefined})).toEqual("<fooBar a=\"\"/>\n");
      
      expect(_.fooBar(null)).toEqual("<fooBar/>\n");
      expect(_.fooBar(undefined)).toEqual("<fooBar></fooBar>\n");
    });
  });
  
  describe("attribute mappings", function() {
    it("converts mapped attributes to the appropriate name in the output", function(){
       expect(_.fooBar({iDontCauseProblems:"zzz"})).
      toEqual("<fooBar iCauseProblemsInJsButNotInBuilderOutput=\"zzz\"/>\n");
    });
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
  
  describe("array children", function() {
    it("renders an array of nodes as a series of child nodes.  " +
       "this is often useful when you want to $.map or _.map an array of objects into the equivalent array of nodes.", function(){
      expect(_.fooBar(
               [_.x(), _.y()], 
               _.z()
            )).
     toEqual("<fooBar>\n" +
               "<x/>\n" +
               "<y/>\n" +
               "<z/>\n" +
             "</fooBar>\n");
    });    
  
    it("works with mixed node and textnodes", function(){
      expect(_.fooBar(
               [_.x(), "y"], 
               "z"
            )).
     toEqual("<fooBar>\n" +
               "<x/>\n" +
             "yz</fooBar>\n");
    });    
  
    it("renders arrays of arrays too", function(){
       expect(_.fooBar(
               [[_.x(), [_.y()]]],
               _.z())
             ).
      toEqual("<fooBar>\n" +
                "<x/>\n" +
                "<y/>\n" +
                "<z/>\n" +
              "</fooBar>\n");
    });    
  
    it("renders children of children in arrays properly", function(){
      expect(_.fooBar([[ _.x(_.J()) , 
                       [ _.y(_.K()) ]]],
                      _.z())).
     toEqual("<fooBar>\n" +
               "<x>\n" +
                 "<J/>\n" +
               "</x>\n" +
               "<y>\n" +
                 "<K/>\n" +
               "</y>\n" +
               "<z/>\n" +
             "</fooBar>\n");
    });    
  
    it("renders array children, plus attributes, properly (bug)", function(){
      expect(_.fooBar({x:"y"}, [_.x(), _.y()])).
     toEqual("<fooBar x=\"y\">\n" +
               "<x/>\n" +
               "<y/>\n" +
             "</fooBar>\n");
    });    
  
  })
  
  describe("textnode children", function() {
    it("renders a single textnode child all on one line", function(){
      expect(_.fooBar("x")).
     toEqual("<fooBar>x</fooBar>\n");
    });
  
    it("renders text nodes in one line, on a new line if there are multiple textnode children", function(){
      expect(_.fooBar("x", "y")).
     toEqual("<fooBar>xy</fooBar>\n");
    });

    it("renders mixed text and element nodes - elements have newlines and text nodes do not", function(){
      expect(_.fooBar("x", _.J(), "y", _.K())).
     toEqual("<fooBar>x<J/>\ny<K/>\n</fooBar>\n");
    });
  });
  
  describe("special Root function", function() {
    it("joins together everything handed to it", function(){
      expect(_.Root(_.x(), _.y())).
     toEqual("<x/>\n<y/>\n");
    });
  });
  
});

