package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.lucasmunarolo.geradordocumentos.document.Document;
import com.lucasmunarolo.geradordocumentos.document.components.Clause;
import com.lucasmunarolo.geradordocumentos.document.components.Conditional;
import com.lucasmunarolo.geradordocumentos.document.components.DocumentComponent;
import com.lucasmunarolo.geradordocumentos.document.components.Header;
import com.lucasmunarolo.geradordocumentos.document.components.Image;
import com.lucasmunarolo.geradordocumentos.document.components.LineBreak;
import com.lucasmunarolo.geradordocumentos.document.components.Loop;
import com.lucasmunarolo.geradordocumentos.document.components.Paragraph;
import com.lucasmunarolo.geradordocumentos.document.components.Signature;
import com.lucasmunarolo.geradordocumentos.document.components.Title;
import com.lucasmunarolo.geradordocumentos.document.components.UnorderedList;

@Component
public class DocumentHtmlParser {

    public String parse(Document document, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        return parseComponents(document.components(), variables, loopVariables);
    }

    public static String parseComponents(List<DocumentComponent> components, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        StringBuilder html = new StringBuilder();
        for (DocumentComponent component : components) {
            html.append(switch (component) {
                case Clause c         -> ClauseHtmlParser.parse(c, variables, loopVariables);
                case Paragraph p      -> ParagraphHtmlParser.parse(p, variables, loopVariables);
                case LineBreak lb     -> LineBreakHtmlParser.parse(lb);
                case UnorderedList ul -> UnorderedListHtmlParser.parse(ul, variables, loopVariables);
                case Title t          -> TitleHtmlParser.parse(t, variables, loopVariables);
                case Loop l           -> LoopHtmlParser.parse(l, variables, loopVariables);
                case Conditional ct   -> ConditionalHtmlParser.parse(ct, variables, loopVariables);
                case Signature s      -> SignatureHtmlParser.parse(s, variables, loopVariables);
                case Header h         -> HeaderHtmlParser.parse(h, variables, loopVariables);
                case Image i          -> ImageHtmlParser.parse(i, variables, loopVariables);
            });
        }
        return html.toString();
    }
}
