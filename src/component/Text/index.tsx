import React from "react";
import "./index.css";

interface Props {
    ellipsis?: boolean;
    children: React.ReactNode;
}

const Text: React.FC<Props> = ({ ellipsis = false, children }) => {
    const containerStyle = {
      overflow: "hidden",
      textOverflow: ellipsis ? "ellipsis" : undefined,
    };

    return <div className="text-container" style={containerStyle}>{children}</div>;
};

export default Text;
