import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Editor, EditorProps, EditorTools, EditorUtils } from '@progress/kendo-react-editor';



const {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Indent,
    Outdent,
    OrderedList,
    UnorderedList,
    Undo,
    Redo,
    FontSize,
    FontName,
    FormatBlock,
    Link,
    Unlink,
    InsertImage,
    ViewHtml,
    InsertTable,
    AddRowBefore,
    AddRowAfter,
    AddColumnBefore,
    AddColumnAfter,
    DeleteRow,
    DeleteColumn,
    DeleteTable,
    MergeCells,
    SplitCell
} = EditorTools;

export default forwardRef(({ customToolbarActions = [], ...props }:any, ref) => {

    const editorRef = useRef<any>(null);
    

  
    useImperativeHandle(ref, () => ({
        setHtml: (html: string) => {
        if (editorRef.current) {
            EditorUtils.setHtml(editorRef.current.view,html)
        }
        }
    }));
  
    return <Editor
            {...props}
            ref={editorRef}
            tools={[
                ...customToolbarActions,
                [Bold, Italic, Underline, Strikethrough],
                [Subscript, Superscript],
                [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                [Indent, Outdent],
                [OrderedList, UnorderedList],
                FontSize,
                FontName,
                FormatBlock,
                [Undo, Redo],
                [Link, Unlink, InsertImage, ViewHtml],
                [InsertTable],
                [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                [DeleteRow, DeleteColumn, DeleteTable],
                [MergeCells, SplitCell],
                
            ]}
            defaultEditMode="div"
            
        />
})