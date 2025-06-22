import { useEffect } from "react"
import { useState } from "react"

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLElement>
    bottomRef: React.RefObject<HTMLElement>
    shouldLoadMore: boolean 
    loadMore : () => void
    count: number
}

export const useScroll = ({chatRef, bottomRef, shouldLoadMore, loadMore, count}: ChatScrollProps) => {
       const [hasInitialized, setHasInitialized] = useState(false)

       useEffect(() => {
        const chatElement = chatRef?.current

        const onScroll = () => {

            if (chatElement) {
                const { scrollTop, scrollHeight, clientHeight } = chatElement

                if (scrollTop + clientHeight > scrollHeight - 20 && shouldLoadMore) {
                    loadMore()
                }
            }
        }

        chatElement?.addEventListener('scroll', onScroll)

        return () => {
            chatElement?.removeEventListener('scroll', onScroll)
        }
       }, [chatRef, shouldLoadMore, loadMore])

       useEffect(() => {
        const bottomDiv= bottomRef?.current
        const topDiv = chatRef.current
        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true)
                return true
            }

            if(!topDiv) {
                return false
            }   

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
            return distanceFromBottom <=100
        }

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef?.current?.scrollIntoView({behavior: 'smooth'})
            }, 100)
        }

       }, [count])

}