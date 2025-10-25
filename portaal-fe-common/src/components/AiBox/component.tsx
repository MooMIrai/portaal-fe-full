import { FloatingActionButton } from "@progress/kendo-react-buttons";
import { AIPrompt, commandsViewDefaults, AIPromptCommandsView, CommandInterface } from "@progress/kendo-react-conversational-ui";
import { Popup } from "@progress/kendo-react-popup";
import { xIcon, sparklesIcon, exeIcon } from "@progress/kendo-svg-icons";
import React, { PropsWithChildren } from "react";

export default function AiBox(props:PropsWithChildren<{
    commands: CommandInterface[], 
    onCommandExecute:((command: CommandInterface,closePopup:()=>void) => void) | undefined
}>) {
    const anchorRef = React.useRef<any>(null);
    const [showAIPrompt, setShowAIPrompt] = React.useState<boolean>(false);
    const [activeView, setActiveView] = React.useState<string>(commandsViewDefaults.name);

    const toggleAIPrompt = () => {
        setShowAIPrompt(!showAIPrompt);
    };

    const handleActiveViewChange = (viewName: string) => {
        setActiveView(viewName);
    };

    return <div className="component-container">
        {props.children}
        <FloatingActionButton
            style={{ zIndex: 2 }}
            ref={anchorRef}
            svgIcon={showAIPrompt ? xIcon : sparklesIcon}
            align={{
                horizontal: 'end',
                vertical: 'bottom'
            }}
            alignOffset={{
                x: 40,
                y: 40
            }}
            positionMode="fixed"
            onClick={toggleAIPrompt}
        />
        <Popup
            anchor={anchorRef.current?.element}
            show={showAIPrompt}
            popupAlign={{ vertical: 'bottom', horizontal: 'right' }}
            anchorAlign={{ vertical: 'bottom', horizontal: 'left' }}
        >
            <AIPrompt
                style={{ width: '400px', height: '400px' }}
                activeView={activeView}
                onActiveViewChange={handleActiveViewChange}
                //onPromptRequest={handleOnRequest}
                onCommandExecute={(c) => props.onCommandExecute ? props.onCommandExecute(c, () => setShowAIPrompt(false)) : null}
                toolbarItems={[
                    //promptViewDefaults, outputViewDefaults,
                    { ...commandsViewDefaults, buttonText: "Comandi", buttonIcon: exeIcon }
                ]}
            >
                {/* <AIPromptView promptSuggestions={suggestionsList} />
                        <AIPromptOutputView outputs={outputs} showOutputRating={true} /> */}
                <AIPromptCommandsView commands={props.commands} />
            </AIPrompt>
        </Popup>
        </div>
}