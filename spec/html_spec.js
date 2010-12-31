require("./spec_helper.js");

describe("Jbob html", function() {
  
  describe("all html tags", function() {
    it("a giant integration test for all html tags, so we see what we're allowing.", function(){
      _ = {}
      Jbob.htmlTags(_)
      
      expect(_.html(
               _.head(
                 _.meta(), _.script(), _.title(), _.link()
               ),
               _.body(
                 _.div(), _.p(), _.span(), _.a(), _.img(),
                 _.br(), _.hr(),
                 _.table(
                   _.thead(_.tr(_.th())),
                   _.tbody(_.tr(_.td()))
                 ),
                 _.ul(_.li(), _.ol()),
                 _.dl(), _.dt(), _.dd(),
                 _.h1(), _.h2(), _.h3(), _.h4(), _.h5(), _.h6(), _.h7(),
                 _.form(
                   _.fieldset(
                     _.label(),
                     _.input(),
                     _.textarea(),
                     _.button()
                   )
                 )
               )
             )).
     toEqual("<html>\n" +
               "<head>\n" +
                 "<meta/>\n<script></script>\n<title/>\n<link/>\n" +
               "</head>\n" +
               "<body>\n" +
                 "<div/>\n<p/>\n<span/>\n<a/>\n<img/>\n" +
                 "<br/>\n<hr/>\n" +
                 "<table>\n" +
                   "<thead>\n<tr>\n<th/>\n</tr>\n</thead>\n" +
                   "<tbody>\n<tr>\n<td/>\n</tr>\n</tbody>\n" +
                 "</table>\n" +
                 "<ul>\n<li/>\n<ol/>\n</ul>\n" +
                 "<dl/>\n<dt/>\n<dd/>\n" +
                 "<h1/>\n<h2/>\n<h3/>\n<h4/>\n<h5/>\n<h6/>\n<h7/>\n" +
                 "<form>\n" +
                   "<fieldset>\n" +
                     "<label/>\n" +
                     "<input/>\n" +
                     "<textarea></textarea>\n" + //I'm not self-closing
                     "<button/>\n" +
                   "</fieldset>\n" +
                 "</form>\n" +
               "</body>\n" +
             "</html>\n");
    });
  });
  
});

