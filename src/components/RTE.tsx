"use client"

import dynamic from "next/dynamic";
import Editor from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then(mod => {
    return mod.default
})
, { ssr: false });


export const MarkDownPreview = Editor.Markdown
export default MDEditor

