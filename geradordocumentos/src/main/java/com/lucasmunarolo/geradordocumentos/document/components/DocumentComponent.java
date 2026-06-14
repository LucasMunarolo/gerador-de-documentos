package com.lucasmunarolo.geradordocumentos.document.components;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = Clause.class, name = "CLAUSE"),
    @JsonSubTypes.Type(value = Paragraph.class, name = "PARAGRAPH"),
    @JsonSubTypes.Type(value = LineBreak.class, name = "LINE_BREAK"),
    @JsonSubTypes.Type(value = UnorderedList.class, name = "UNORDERED_LIST"),
    @JsonSubTypes.Type(value = Title.class, name = "TITLE"),
    @JsonSubTypes.Type(value = Loop.class, name = "LOOP"),
    @JsonSubTypes.Type(value = Conditional.class, name = "CONDITIONAL"),
    @JsonSubTypes.Type(value = Signature.class, name = "SIGNATURE"),
    @JsonSubTypes.Type(value = Header.class, name = "HEADER"),
    @JsonSubTypes.Type(value = Image.class, name = "IMAGE")
})
public sealed interface DocumentComponent 
    permits Clause, Paragraph, LineBreak, UnorderedList, Title, Loop, Conditional, Signature, Header, Image {}
