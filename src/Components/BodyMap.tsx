import React, { useState, useEffect } from "react";
import { Drawer, List, Typography, Tooltip, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import clickSfx from "../assets/click.mp3";

import {
  EyeOutlined,
  AimOutlined,
  InteractionOutlined,
  DotChartOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const injuriesData: Record<
  string,
  {
    icon: React.ReactNode;
    title: string;
    items: { label: string; videoUrl: string }[];
  }
> = {
  head: {
    icon: <EyeOutlined />,
    title: "Cabeza",
    items: [
      { label: "Conmoción cerebral", videoUrl: "https://www.youtube.com/watch?v=SbcP1KCeucU" },
      { label: "Migraña tensional", videoUrl: "https://www.youtube.com/watch?v=LL177F4DGdM" },
      { label: "Hematoma subdural", videoUrl: "https://www.youtube.com/watch?v=12ilgnUdoRE" },
    ],
  },
  shoulder: {
    icon: <AimOutlined />,
    title: "Hombro",
    items: [
      { label: "Tendinitis manguito rotador", videoUrl: "https://www.youtube.com/watch?v=YDDN-V4Hk9o" },
      { label: "Luxación de hombro", videoUrl: "https://www.youtube.com/watch?v=oyyLFM8ZL_Q" },
      { label: "Bursitis subacromial", videoUrl: "https://www.youtube.com/watch?v=z1Ej_kgX1J0" },
    ],
  },
  elbow: {
    icon: <InteractionOutlined />,
    title: "Codo",
    items: [
      { label: "Epicondilitis", videoUrl: "https://www.youtube.com/watch?v=PNDVzRJh3uQ" },
      { label: "Bursitis olecraniana", videoUrl: "https://www.youtube.com/watch?v=tTQGoJ-p9Sk" },
      { label: "Fractura del olécranon", videoUrl: "https://www.youtube.com/watch?v=V08jZCXerOw" },
    ],
  },
  knee: {
    icon: <DotChartOutlined />,
    title: "Rodilla",
    items: [
      { label: "Lesión de menisco", videoUrl: "https://www.youtube.com/watch?v=0EE2XGM3Pps" },
      { label: "Rotura LCA", videoUrl: "https://www.youtube.com/watch?v=IkJLoTlC8ds" },
      { label: "Condromalacia rotuliana", videoUrl: "https://www.youtube.com/watch?v=uUTxH8vdimA" },
    ],
  },
  ankle: {
    icon: <HeartOutlined />,
    title: "Tobillo",
    items: [
      { label: "Esguince de tobillo", videoUrl: "https://www.youtube.com/watch?v=xfKjFtES5fk" },
      { label: "Luxación de tobillo", videoUrl: "https://www.youtube.com/watch?v=R1To9_KF1e8" },
      { label: "S. seno del tarso", videoUrl: "https://www.youtube.com/watch?v=-KKZ10WBqNw" },
    ],
  },
};

const hotspotPositions: Record<
  string,
  { top: string; left: string; w: number; h: number }
> = {
  head:     { top: "2%",  left: "47%", w: 40, h: 40 },
  shoulder: { top: "16%", left: "26%", w: 60, h: 40 },
  elbow:    { top: "30%", left: "64%", w: 50, h: 40 },
  knee:     { top: "68%", left: "35%", w: 70, h: 50 },
  ankle:    { top: "90%", left: "52%", w: 70, h: 50 },
};

export const BodyMapDynamic: React.FC = () => {
  const [zone, setZone] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [play] = useSound(clickSfx, { volume: 0.5 });

  // Efecto de guía inicial
  useEffect(() => {
    const first = Object.keys(injuriesData)[0];
    setTimeout(() => setZone(first), 800);
    setTimeout(() => setZone(null), 2000);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: 400,
        margin: "50px auto",
        textAlign: "center",
      }}
    >
      <img
        src="/anatomy.png"
        alt="Anatomía"
        style={{ width: "100%", display: "block", margin: "0 auto" }}
      />

      {Object.keys(injuriesData).map(key => {
        const pos = hotspotPositions[key];
        return (
          <Tooltip key={key} title={injuriesData[key].title} mouseEnterDelay={0.3}>
            <motion.div
              onClick={() => {
                play();
                setPreviewUrl(null);
                setZone(key);
              }}
              initial={false}
              animate={zone === key ? { scale: 1.2, opacity: 1 } : { scale: 1, opacity: 0.6 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                width: pos.w,
                height: pos.h,
                borderRadius: "50%",
                background: "rgba(255,0,0,0.4)",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        );
      })}

      <Drawer
        title={
          zone ? (
            <span>
              {injuriesData[zone].icon}{" "}
              <Typography.Title level={4} style={{ display: "inline" }}>
                {injuriesData[zone].title}
              </Typography.Title>
            </span>
          ) : null
        }
        placement="right"
        onClose={() => {
          setZone(null);
          setPreviewUrl(null);
        }}
        open={!!zone}
        width={320}
        bodyStyle={{ paddingBottom: 24 }}
      >
        <AnimatePresence>
          {zone && (
            <motion.div
              key={zone}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
            >
              <List
                dataSource={injuriesData[zone].items}
                renderItem={item => (
                  <List.Item
                    style={{ cursor: "pointer" }}
                    onClick={() => setPreviewUrl(item.videoUrl)}
                  >
                    {item.label}
                  </List.Item>
                )}
              />

              {previewUrl && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 200 }}
                  exit={{ height: 0 }}
                  style={{ overflow: "hidden", marginTop: 16 }}
                >
                  <iframe
                    width="100%"
                    height="200"
                    src={previewUrl.replace("watch?v=", "embed/")}
                    title="Preview"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ border: "none", borderRadius: 8 }}
                  />
                  <Button
                    type="link"
                    onClick={() => window.open(previewUrl, "_blank")}
                    style={{ marginTop: 8 }}
                  >
                    Ver en YouTube
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>
    </div>
  );
};
