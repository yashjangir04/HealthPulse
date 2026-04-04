import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const ZegoCloud = () => {
  const containerRef = useRef(null);
  const { roomID } = useParams();

  useEffect(() => {
    if (!roomID) return;

    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = "user_" + userID;

    const appID = parseInt(import.meta.env.VITE_ZC_APP_ID) ;
    const serverSecret = import.meta.env.VITE_ZC_SERVER_SECRET ;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName,
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,

      sharedLinks: [
        {
          name: "Invite link",
          url: `${window.location.origin}/room/${roomID}`,
        },
      ],

      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },

      themeConfig: {
        mode: "light", 
        primaryColor: "#fff", 
      },

      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,

      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,

      maxUsers: 2,
      layout: "Auto",
      showLayoutButton: false,
    });

    return () => {
      zp.destroy();
    };
  }, [roomID]);

  return <div ref={containerRef} className="w-full h-full relative" />
};

export default ZegoCloud;
