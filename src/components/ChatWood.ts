import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ChatWood = () => {
  const pathname = usePathname();
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    if (!widgetLoaded) return;
    const chatwood = document.querySelector("button.woot-widget-bubble");
    if (pathname.includes("auth")) {
      if (chatwood) {
        chatwood.classList.remove("woot-elements--left");
        chatwood.classList.add("woot-elements--right");
      }
    } else {
      if (chatwood) {
        chatwood.classList.remove("woot-elements--right");
        chatwood.classList.add("woot-elements--left");
      }
    }
  }, [pathname, widgetLoaded]);

  useEffect(() => {
    const BASE_URL = "https://app.chatwoot.com";

    // Create the script element
    const script = document.createElement("script");
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.defer = true;
    script.async = true;

    // Append the script to the document
    document.body.appendChild(script);

    // Handle script load
    script.onload = () => {
      // Initialize Chatwoot settings and SDK
      //@ts-ignore
      window.chatwootSettings = {
        hideMessageBubble: false,
        position: "left", // This can be left or right
        locale: "de", // Language to be set
        type: "standard", // [standard, expanded_bubble]
      };
      //@ts-ignore
      window.chatwootSDK.run({
        websiteToken: "VEsfYg2xaejGmiArkzgJpvPq", // Replace with your actual token
        baseUrl: BASE_URL,
      });

      // Poll for the presence of the chat bubble
      const pollForChatBubble = () => {
        const chatBubble = document.querySelector("button.woot-widget-bubble"); // Update selector if needed
        if (chatBubble) {
          console.log("Chatwoot widget is fully loaded and visible");
          setWidgetLoaded(true);
        } else {
          setTimeout(pollForChatBubble, 100); // Check again in 100ms
        }
      };

      pollForChatBubble();
    };

    // Handle script load error
    script.onerror = () => {
      console.error("Failed to load Chatwoot widget script");
    };

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default ChatWood;
