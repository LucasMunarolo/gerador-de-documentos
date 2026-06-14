package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.List;
import java.util.Map;

import com.lucasmunarolo.geradordocumentos.document.TextRun;
import com.lucasmunarolo.geradordocumentos.document.components.Signature;

public class SignatureHtmlParser {

    public static String parse(Signature signature, Map<String, String> variables,
            Map<String, List<String>> loopVariables) {
        String name = TextRunHtmlParser.parse(List.of(new TextRun(signature.name(), List.of(), null)), variables,
                loopVariables);
        String document = TextRunHtmlParser.parse(List.of(new TextRun(signature.document(), List.of(), null)),
                variables, loopVariables);
        return """
                <div style='margin-top:48pt;text-align:center;'>
                    <div style='border-top:1px solid black;width:60%%;margin:0 auto;'></div>
                    <p style='margin:2pt 0;text-align:center;'>%s</p>
                    <p style='margin:2pt 0;text-align:center;'>%s</p>
                </div>
                """.formatted(name, document);
    }
}
