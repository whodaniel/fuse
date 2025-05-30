import React, { useEffect, useState } from "react";
import Workspace from "@/models/workspace";
import LoadingChat from './LoadingChat.js';
import ChatContainer from './ChatContainer.js';
import paths from "@/utils/paths";
import ModalWrapper from '../ModalWrapper.js';
import { useParams } from "react-router-dom";
import { DnDFileUploaderProvider } from './ChatContainer/DnDWrapper.js';
import { WorkspaceData } from "@/types/workspace";

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string;
  metadata?: Record<string, any>;
}

interface WorkspaceChatProps {
  loading: boolean;
  workspace: WorkspaceData | null;
}

export default function WorkspaceChat({ loading, workspace }: WorkspaceChatProps): JSX.Element {
  const { threadSlug = null } = useParams<{ threadSlug?: string }>();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    async function getHistory() {
      if (loading) return;
      if (!workspace?.slug) {
        setLoadingHistory(false);
        return false;
      }

      const chatHistory = threadSlug
        ? await Workspace.threads.chatHistory(workspace.slug, threadSlug)
        : await Workspace.chatHistory(workspace.slug);

      setHistory(chatHistory);
      setLoadingHistory(false);
    }
    getHistory();
  }, [workspace, loading, threadSlug]);

  if (loadingHistory) return <LoadingChat />;
  if (!loading && !loadingHistory && !workspace) {
    return (
      <>
        {loading === false && !workspace && (
          <ModalWrapper isOpen={true}>
            <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
              <div className="flex flex-col gap-y-4 w-full p-6 text-center">
                <p className="font-semibold text-red-500 text-xl">
                  Workspace not found!
                </p>
                <p className="text-sm mt-4 text-white">
                  It looks like a workspace by this name is not available.
                </p>

                <div className="flex w-full justify-center items-center mt-4">
                  <a
                    href={paths.home()}
                    className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm flex items-center gap-x-2"
                  >
                    Go back to homepage
                  </a>
                </div>
              </div>
            </div>
          </ModalWrapper>
        )}
        <LoadingChat />
      </>
    );
  }

  setEventDelegatorForCodeSnippets();
  return (
    <DnDFileUploaderProvider workspace={workspace}>
      <ChatContainer workspace={workspace} knownHistory={history} />
    </DnDFileUploaderProvider>
  );
}

// Enables us to safely markdown and sanitize all responses without risk of injection
// but still be able to attach a handler to copy code snippets on all elements
// that are code snippets.
function copyCodeSnippet(uuid: string): boolean {
  const target = document.querySelector(`[data-code="${uuid}"]`);
  if (!target) return false;
  const markdown =
    target.parentElement?.parentElement?.querySelector(
      "pre:first-of-type"
    )?.innerText;
  if (!markdown) return false;

  window.navigator.clipboard.writeText(markdown);
  target.classList.add("text-green-500");
  const originalText = target.innerHTML;
  target.innerText = "Copied!";
  target.setAttribute("disabled", "true");

  setTimeout(() => {
    target.classList.remove("text-green-500");
    target.innerHTML = originalText;
    target.removeAttribute("disabled");
  }, 2500);
  
  return true;
}

// Listens and hunts for all data-code-snippet clicks.
export function setEventDelegatorForCodeSnippets(): void {
  document?.addEventListener("click", function (e: MouseEvent) {
    const target = (e.target as Element).closest("[data-code-snippet]");
    const uuidCode = target?.getAttribute("data-code");
    if (!uuidCode) return;
    copyCodeSnippet(uuidCode);
  });
}