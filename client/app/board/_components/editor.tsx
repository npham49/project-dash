"use client";

import { defaultExtensions } from "@/lib/editor-extension";
import { slashCommand, suggestionItems } from "@/lib/editor-slash-commands";
import { UseMutationResult } from "@tanstack/react-query";
import { debounce } from "lodash";
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { useCallback, useEffect, useState } from "react";

const TailwindEditor = ({
  initialContent,
  updateContent,
}: {
  initialContent: JSONContent;
  updateContent: UseMutationResult<void, unknown, JSONContent, unknown>;
}) => {
  const extensions = [...defaultExtensions, slashCommand];
  const [saveStatus, setSaveStatus] = useState("Synced");
  const [domLoaded, setDomLoaded] = useState(false);
  const [content, setContent] = useState<JSONContent | undefined>(
    initialContent || {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: {
            level: 1,
          },
          content: [
            {
              type: "text",
              text: "Let's ideate 💡",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "How do we do this?",
            },
          ],
        },
      ],
    }
  );
  const debouncedUpdateNotes = useCallback(
    debounce(async () => {
      updateContent.mutate(
        content ||
          initialContent || {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: {
                  level: 1,
                },
                content: [
                  {
                    type: "text",
                    text: "Let's ideate 💡",
                  },
                ],
              },
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "How do we do this?",
                  },
                ],
              },
            ],
          }
      );

      setSaveStatus("Synced");
    }, 3000),
    [content]
  );

  useEffect(() => {
    debouncedUpdateNotes();
    return () => {
      debouncedUpdateNotes.cancel();
    };
  }, [content, debouncedUpdateNotes]);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <>
      {domLoaded && (
        <EditorRoot>
          <EditorContent
            className="border p-4 rounded-xl"
            // {...(initialValue && { initialContent: initialValue })}
            initialContent={content}
            extensions={extensions}
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              attributes: {
                class: `prose prose-sm dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
              },
            }}
            onUpdate={({ editor }) => {
              setSaveStatus("Out of Sync");
              setContent(editor.getJSON());
            }}
            slotBefore={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <div
                  className={`bg-accent py-1 rounded-md max-w-20 ml-auto relative text-center ${
                    saveStatus === "Out of Synced"
                      ? "animate-pulse w-20 "
                      : "w-16"
                  }`}
                >
                  <span className="text-xs text-muted-foreground">
                    {saveStatus}
                  </span>
                </div>
              </div>
            }
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command?.(val)}
                    className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>
          </EditorContent>
        </EditorRoot>
      )}
    </>
  );
};
export default TailwindEditor;
