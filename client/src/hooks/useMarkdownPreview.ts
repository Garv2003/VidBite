import { useState, useEffect } from "react";
import showdown from "showdown";

export const useMarkdownPreview = (markdown: string) => {
    const [previewHtml, setPreviewHtml] = useState("");

    useEffect(() => {
        const converter = new showdown.Converter();
        const html = converter.makeHtml(markdown);
        setPreviewHtml(html);
    }, [markdown]);

    return previewHtml;
};