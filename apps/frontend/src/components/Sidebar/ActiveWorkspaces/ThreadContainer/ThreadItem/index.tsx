import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowCounterClockwise, DotsThree, PencilSimple, Trash, X, } from "@phosphor-icons/react";
import truncate from "truncate";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
const STYLES = {
    container: "w-full relative flex h-[38px] items-center border-none rounded-lg",
    curvedLine: (isActive) => `${isActive
        ? "border-l-2 border-b-2 border-white light:border-theme-sidebar-border z-30"
        : "border-l border-b border-[#6F6F71] light:border-theme-sidebar-border z-10"} h-[50%] absolute top-0 left-2 rounded-bl-lg`,
    downstroke: (idx, activeIdx, isActive) => `${idx <= activeIdx && !isActive
        ? "border-l-2 border-white light:border-theme-sidebar-border z-20"
        : "border-l border-[#6F6F71] light:border-theme-sidebar-border z-10"} h-[100%] absolute top-0 left-2`,
    threadContent: (isActive) => `flex w-full items-center justify-between pr-2 group relative ${isActive
        ? "bg-[var(--theme-sidebar-thread-selected)] border border-solid border-transparent light:border-blue-400"
        : "hover:bg-theme-sidebar-subitem-hover"} rounded-[4px]`,
    deletedText: "text-left text-sm text-slate-400/50 light:text-slate-500 italic",
    threadName: (isActive) => `text-left text-sm ${isActive ? "font-medium text-white" : "text-theme-text-primary"}`,
    optionsButton: "text-zinc-300 light:text-theme-text-secondary hover:text-white hover:light:text-theme-text-primary",
    optionsMenu: "absolute w-fit z-[20] top-[25px] right-[10px] bg-zinc-900 light:bg-theme-bg-sidebar light:border-[1px] light:border-theme-sidebar-border rounded-lg p-1",
    menuButton: "w-full rounded-md flex items-center p-2 gap-x-2",
    renameButton: "hover:bg-slate-500/20 text-slate-300 light:text-theme-text-primary",
    deleteButton: "hover:bg-red-500/20 text-slate-300 light:text-theme-text-primary hover:text-red-100",
};
const THREAD_CALLOUT_DETAIL_WIDTH = 26;
export default function ThreadItem({ idx, activeIdx, isActive, workspace, thread, onRemove, toggleMarkForDeletion, hasNext, ctrlPressed = false, }) {
    const { slug } = useParams();
    const optionsContainer = useRef(null);
    const [showOptions, setShowOptions] = useState(false);
    const linkTo = !thread.slug
        ? paths.workspace.chat(slug)
        : paths.workspace.thread(slug, thread.slug);
    return (<div className={STYLES.container} role="listitem">
      
      <div style={{ width: THREAD_CALLOUT_DETAIL_WIDTH / 2 }} className={STYLES.curvedLine(isActive)}/>
      
      {hasNext && (<div style={{ width: THREAD_CALLOUT_DETAIL_WIDTH / 2 }} className={STYLES.downstroke(idx, activeIdx, isActive)}/>)}

      <div style={{ width: THREAD_CALLOUT_DETAIL_WIDTH + 8 }} className="h-full"/>
      <div className={STYLES.threadContent(isActive)}>
        {thread.deleted ? (<div className="w-full flex justify-between">
            <div className="w-full pl-2 py-1">
              <p className={STYLES.deletedText}>deleted thread</p>
            </div>
            {ctrlPressed && (<button type="button" className="border-none" onClick={() => toggleMarkForDeletion(thread.id)}>
                <ArrowCounterClockwise className={STYLES.optionsButton} size={18}/>
              </button>)}
          </div>) : (<a href={window.location.pathname === linkTo || ctrlPressed ? "#" : linkTo} className="w-full pl-2 py-1" aria-current={isActive ? "page" : undefined}>
            <p className={STYLES.threadName(isActive)}>
              {truncate(thread.name, 25)}
            </p>
          </a>)}
        {!!thread.slug && !thread.deleted && (<div ref={optionsContainer} className="flex items-center">
            {ctrlPressed ? (<button type="button" className="border-none" onClick={() => toggleMarkForDeletion(thread.id)}>
                <X className={STYLES.optionsButton} weight="bold" size={18}/>
              </button>) : (<div className="flex items-center w-fit group-hover:visible md:invisible gap-x-1">
                <button type="button" className="border-none" onClick={() => setShowOptions(!showOptions)} aria-label="Thread options">
                  <DotsThree className={STYLES.optionsButton} size={25}/>
                </button>
              </div>)}
            {showOptions && (<OptionsMenu containerRef={optionsContainer} workspace={workspace} thread={thread} onRemove={onRemove} close={() => setShowOptions(false)}/>)}
          </div>)}
      </div>
    </div>);
}
function OptionsMenu({ containerRef, workspace, thread, onRemove, close }) {
    const menuRef = useRef(null);
    const outsideClick = (e) => {
        var _a, _b;
        if (!menuRef.current)
            return false;
        const target = e.target;
        if (!((_a = menuRef.current) === null || _a === void 0 ? void 0 : _a.contains(target)) &&
            !((_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.contains(target)))
            close();
        return false;
    };
    const isEsc = (e) => {
        if (e.key === "Escape" || e.key === "Esc")
            close();
    };
    function cleanupListeners() {
        window.removeEventListener("click", outsideClick);
        window.removeEventListener("keyup", isEsc);
    }
    useEffect(() => {
        function setListeners() {
            if (!(menuRef === null || menuRef === void 0 ? void 0 : menuRef.current) || !containerRef.current)
                return false;
            window.document.addEventListener("click", outsideClick);
            window.document.addEventListener("keyup", isEsc);
        }
        setListeners();
        return cleanupListeners;
    }, [menuRef.current, containerRef.current]);
    const renameThread = async () => {
        var _a;
        const name = (_a = window
            .prompt("What would you like to rename this thread to?")) === null || _a === void 0 ? void 0 : _a.trim();
        if (!name || name.length === 0) {
            close();
            return;
        }
        const { message } = await Workspace.threads.update(workspace.slug, thread.slug, { name });
        if (!!message) {
            showToast(`Thread could not be updated! ${message}`, "error", {
                clear: true,
            });
            close();
            return;
        }
        thread.name = name;
        close();
    };
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this thread? All of its chats will be deleted. You cannot undo this."))
            return;
        const success = await Workspace.threads.delete(workspace.slug, thread.slug);
        if (!success) {
            showToast("Thread could not be deleted!", "error", { clear: true });
            return;
        }
        showToast("Thread deleted successfully!", "success", { clear: true });
        onRemove(thread.id);
    };
    return (<div ref={menuRef} className={STYLES.optionsMenu}>
      <button onClick={renameThread} type="button" className={`${STYLES.menuButton} ${STYLES.renameButton}`}>
        <PencilSimple size={18}/>
        <p className="text-sm">Rename</p>
      </button>
      <button onClick={handleDelete} type="button" className={`${STYLES.menuButton} ${STYLES.deleteButton}`}>
        <Trash size={18}/>
        <p className="text-sm">Delete Thread</p>
      </button>
    </div>);
}
//# sourceMappingURL=index.js.map