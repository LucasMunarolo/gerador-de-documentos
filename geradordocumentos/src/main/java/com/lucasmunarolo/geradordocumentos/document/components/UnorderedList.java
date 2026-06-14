package com.lucasmunarolo.geradordocumentos.document.components;

import java.util.List;

import com.lucasmunarolo.geradordocumentos.document.ListItem;

public record UnorderedList(
    List<ListItem> elements
) implements DocumentComponent {}
