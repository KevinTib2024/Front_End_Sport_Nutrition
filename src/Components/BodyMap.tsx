import { useState } from "react";
import { Drawer, List, Typography } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeOutlined,
  AimOutlined,
  InteractionOutlined,
  DotChartOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const injuriesData: Record<
  string,
  { icon: React.ReactNode; title: string; items: { label: string; videoUrl: string }[] }
> = {
  head: {
    icon: <EyeOutlined />,
    title: "Cabeza",
    items: [
      { label: "Conmoción cerebral", videoUrl: "https://www.youtube.com/watch?v=SbcP1KCeucU" },
      { label: "Migraña tensional",    videoUrl: "https://www.youtube.com/watch?v=LL177F4DGdM" },
      { label: "Hematoma subdural",    videoUrl: "https://www.youtube.com/watch?v=12ilgnUdoRE" },
    ],
  },
  shoulder: {
    icon: <AimOutlined />,
    title: "Hombro",
    items: [
      { label: "Tendinitis del manguito rotador", videoUrl: "https://www.youtube.com/watch?v=YDDN-V4Hk9o" },
      {label: "Luxación de hombro", videoUrl: "https://www.youtube.com/watch?v=oyyLFM8ZL_Q"},
      {label: "Bursitis subacromial", videoUrl: "https://www.youtube.com/watch?v=z1Ej_kgX1J0"}
      // …
    ],
  },
  elbow: {
    icon: <InteractionOutlined />,
    title: "Codo",
    items: [
      { label: "Epicondilitis (codo de tenista)", videoUrl: "https://www.youtube.com/watch?v=PNDVzRJh3uQ" },
      { label: "Bursitis olecraniana", videoUrl: "https://www.youtube.com/watch?v=tTQGoJ-p9Sk"}, 
      { label: "Fractura del olécranon", videoUrl: "https://www.youtube.com/watch?v=V08jZCXerOw"}
    ],
  },
  knee: {
    icon: <DotChartOutlined />,
    title: "Rodilla",
    items: [
      { label: "Lesión de menisco", videoUrl: "https://www.youtube.com/watch?v=0EE2XGM3Pps" },
      { label: "Rotura del ligamento cruzado anterior (LCA)", videoUrl: "https://www.youtube.com/watch?v=IkJLoTlC8ds"},
      { label: "Condromalacia rotuliana", videoUrl: "https://www.youtube.com/watch?v=uUTxH8vdimA"}
    ],
  },
  ankle: {
    icon: <HeartOutlined />,
    title: "Tobillo",
    items: [
      { label: "Esguince de tobillo", videoUrl: "https://www.youtube.com/watch?v=xfKjFtES5fk" },
      { label: "Luxación de tobillo", videoUrl: "https://www.youtube.com/watch?v=R1To9_KF1e8"},
      { label: "Síndrome del seno del tarso", videoUrl: "https://www.youtube.com/watch?v=-KKZ10WBqNw"}
    ],
  },
};

export const BodyMapDynamic = () => {
  const [zone, setZone] = useState<string | null>(null);

  // ← ¡Aquí está la función que faltaba!
  const handleItemClick = (url: string) => {
    window.open(url, "_blank", "noopener");
  };

  return (
    <div
      style={{
        position: "relative",
        width: 400,
        margin: "50px auto",
        textAlign: "center",
      }}
    >
      {/* Imagen centrándola */}
      <img
        src="/anatomy.png"
        alt="Anatomía"
        style={{ width: "100%", display: "block", margin: "0 auto" }}
      />

      {/* Áreas invisibles clicables */}
      {Object.keys(injuriesData).map((key) => {
        const pos = {
          head:     { top: "2%",  left: "47%", w: 40, h: 40 },
          shoulder: { top: "16%", left: "26%", w: 60, h: 40 },
          elbow:    { top: "30%", left: "64%", w: 50, h: 40 },
          knee:     { top: "68%", left: "35%", w: 70, h: 50 },
          ankle:    { top: "90%", left: "52%", w: 70, h: 50 },
        } as any;

        return (
          <button
            key={key}
            aria-label={key}
            onClick={() => setZone(key)}
            style={{
              position: "absolute",
              top: pos[key].top,
              left: pos[key].left,
              width: pos[key].w,
              height: pos[key].h,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          />
        );
      })}

      {/* Drawer de Antd */}
      <Drawer
        title={
          zone ? (
            <span>
              {injuriesData[zone].icon}{" "}
              <Typography.Title level={4} style={{ display: "inline" }}>
                {injuriesData[zone].title}
              </Typography.Title>
            </span>
          ) : (
            ""
          )
        }
        placement="right"
        onClose={() => setZone(null)}
        visible={!!zone}
        width={300}
      >
        <AnimatePresence>
          {zone && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <List
                dataSource={injuriesData[zone].items}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: "pointer" }}
                    onClick={() => handleItemClick(item.videoUrl)}
                  >
                    {item.label}
                  </List.Item>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>
    </div>
  );
};
