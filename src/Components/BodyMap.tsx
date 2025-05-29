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
  { icon: React.ReactNode; title: string; items: string[] }
> = {
  head: {
    icon: <EyeOutlined />,
    title: "Cabeza",
      "items": [
    "Conmoción cerebral",
    "Migraña tensional",
    "Fractura de cráneo",
    "Hematoma subdural",
    "Contusión cerebral",
    "Lesión del cuero cabelludo",
    "Fractura de huesos faciales (pómulo, mandíbula, nariz)",
    "Síndrome post-conmocional",
    "Lesión de la articulación temporomandibular (ATM)",
    "Latigazo cervical con impacto craneal",
    "Neuralgia occipital",
    "Lesión ocular traumática",
    "Pérdida temporal del conocimiento (desmayo por impacto)",
    "Hemorragia intracraneal"
    ],
  },
  shoulder: {
    icon: <AimOutlined />,
    title: "Hombro",
      "items": [
    "Tendinitis del manguito rotador",
    "Luxación de hombro",
    "Desgarro del manguito rotador",
    "Bursitis subacromial",
    "Inestabilidad del hombro",
    "Síndrome de pinzamiento del hombro",
    "Fractura de clavícula",
    "Fractura de húmero proximal",
    "Lesión del labrum glenoideo (como la SLAP)",
    "Artritis acromioclavicular postraumática",
    "Capsulitis adhesiva (hombro congelado)",
    "Tendinosis bicipital",
    "Subluxación recurrente de hombro",
    "Lesión nerviosa del plexo braquial"
    ],
  },
  elbow: {
    icon: <InteractionOutlined />,
    title: "Codo",
      "items": [
    "Epicondilitis (codo de tenista)",
    "Bursitis olecraniana",
    "Epitrocleitis (codo de golfista)",
    "Luxación de codo",
    "Fractura del olécranon",
    "Fractura de cabeza radial",
    "Lesión del ligamento colateral cubital",
    "Tendinitis del tríceps",
    "Compresión del nervio cubital (síndrome del túnel cubital)",
    "Artritis traumática del codo",
    "Osteocondritis disecante del codo",
    "Síndrome de interposición del plica sinovial",
    "Rigidez postraumática del codo"
   ],
  },
  knee: {
    icon: <DotChartOutlined />,
    title: "Rodilla",
    "items": [
    "Lesión de menisco",
    "Rotura del ligamento cruzado anterior (LCA)",
    "Rotura del ligamento cruzado posterior (LCP)",
    "Esguince del ligamento colateral medial (LCM)",
    "Esguince del ligamento colateral lateral (LCL)",
    "Tendinitis rotuliana (rodilla del saltador)",
    "Condromalacia rotuliana",
    "Bursitis prerrotuliana",
    "Luxación de rótula",
    "Síndrome de la banda iliotibial",
    "Fractura de la rótula",
    "Osteocondritis disecante",
    "Lesión del cartílago articular",
    "Quiste de Baker",
    "Artrosis postraumática de rodilla"
    ],
  },
  ankle: {
    icon: <HeartOutlined />,
    title: "Tobillo",
      "items": [
    "Esguince de tobillo",
    "Tendinitis aquílea",
    "Rotura del tendón de Aquiles",
    "Fractura de maléolo (medial, lateral o posterior)",
    "Luxación de tobillo",
    "Síndrome del seno del tarso",
    "Lesión osteocondral del astrágalo",
    "Inestabilidad crónica de tobillo",
    "Bursitis retrocalcánea",
    "Periostitis tibial (shin splints que irradian al tobillo)",
    "Tendinopatía de los peroneos",
    "Compresión del nervio tibial posterior (síndrome del túnel tarsiano)",
    "Artritis postraumática de tobillo",
    "Impigement anterior o posterior del tobillo"
    ],
  },
};

export const BodyMapDynamic = () => {
  const [zone, setZone] = useState<string | null>(null);

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
        style={{ width: "100%", display: "block" }}
      />

      {/* Áreas invisibles clicables */}
      {Object.keys(injuriesData).map((key) => {
        // define posiciones y tamaños por zona
        const pos = {
          head: { top: "2%", left: "47%", w: 40, h: 40 },
          shoulder: { top: "16%", left: "26%", w: 60, h: 40 },
          elbow: { top: "30%", left: "64%", w: 50, h: 40 },
          knee: { top: "68%", left: "35%", w: 70, h: 50 },
          ankle: { top: "90%", left: "52%", w: 70, h: 50 },
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
          zone
            ? (
              <span>
                {injuriesData[zone].icon}{" "}
                <Typography.Title level={4} style={{ display: "inline" }}>
                  {injuriesData[zone].title}
                </Typography.Title>
              </span>
            )
            : ""
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
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>
    </div>
  );
};
