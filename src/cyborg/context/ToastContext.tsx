import * as Toast from "@radix-ui/react-toast"
import { createContext, useContext, useState, ReactNode } from "react"
import { truncateStringFixed } from "../util/truncateAddress";
import { TiArrowRight } from 'react-icons/ti'
import { MdContentCopy } from "react-icons/md";
import CopyToClipboard from 'react-copy-to-clipboard'

type Action = {
    text: string;
    fn: () => void;
}

type ToastTitle = 
    "Transaction Update" | 
    "Transaction Failed" | 
    "Action Taken" | 
    "Failed"

type TxToastMessage = { 
    title: ToastTitle,
    type: "tx";
    txHash: string;
    isErr?: boolean;
    text: string;
    action?: Action
}

type GeneralToastMessage = {
    title: ToastTitle,
    type: "general";
    isErr?: boolean;
    text: string;
}

export type ToastMessage = TxToastMessage | GeneralToastMessage;
type ToastMessageWithId = ToastMessage & {id: number}

type ToastContextType = { 
    showToast: (msg: ToastMessage) => void 
}

const postClass: string = "bg-green-400 bg-opacity-15 text-color-text-1 border border-green-500 rounded-lg p-4 relative"
const errorPostClass: string = "bg-red-400 bg-opacity-15 text-color-text-1 border border-red-500 rounded-lg p-4 relative"


const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ToastMessageWithId[]>([])

  const showToast = (msg: ToastMessage) => {
    setMessages((prev) => [...prev, { id: Date.now(), ...msg }])
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
        <Toast.Provider swipeDirection="right">
        {children}
        {messages.map((m) => (
            <Toast.Root
                key={m.id}
                open
                onOpenChange={(open) => {
                    if (!open) setMessages((prev) => prev.filter((msg) => msg.id !== m.id))
                }}
                className={m.isErr ? errorPostClass : postClass}
            >
                <div className="flex flex-col gap-2">
                    <Toast.Title className="font-bold text-xl">{m.title}</Toast.Title>
                    <Toast.Title className="text-lg">{m.text}</Toast.Title>
                    {
                        m.type === "tx"
                        ? 

                        <CopyToClipboard text={m.txHash}>
                            <Toast.Title 
                                className="font-bold flex items-center gap-2 hover:cursor-pointer" 
                                onClick={() => showToast({type: "general", title: "Action Taken", text: "Transaction hash has been copied!"})}
                            >
                                {`Tx Hash: ${truncateStringFixed(m.txHash, 10)}`}
                                <MdContentCopy/>
                            </Toast.Title>
                        </CopyToClipboard>

                        :
                        <></>
                    }
                    {
                        m.type === "tx" && m.action
                        ? 
                        <Toast.Action onClick={() => m.action.fn()} altText={m.action.text}>
                            <div className="flex items-center font-bold text-lg hover:text-color-foreground">{m.action.text}<TiArrowRight/></div>
                        </Toast.Action>
                        : <></>
                    }
                </div>
                <Toast.Close className="absolute top-2 right-4 text-lg">✕</Toast.Close>
            </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-0 right-0 p-4 space-y-2 w-96 max-w-full outline-none" />
        </Toast.Provider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
