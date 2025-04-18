import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faBullseye, faInfoCircle, faHistory } from "@fortawesome/free-solid-svg-icons";
import './HomeScreen.css';
import { useAuth } from "../../../Context/AuthContext";
import { useState } from "react";

interface WorkoutRoom {
  nombre: string;
  descripcion: string;
  resumen: string;
  icon: any; // Ajusta el tipo si tienes un tipo específico para el ícono
  image?: string;
}

const workoutRooms: WorkoutRoom[] = [
    {
        nombre: "Visión",
        descripcion: "Ser una plataforma líder en bienestar físico y mental, promoviendo hábitos saludables y transformación personal.",
        resumen: "Visualizamos una comunidad fuerte, disciplinada y motivada, enfocada en alcanzar su mejor versión día a día.",
        icon: faEye,
      },
      {
        nombre: "Misión",
        descripcion: "Inspirar y guiar a las personas en su camino hacia una vida activa, saludable y equilibrada mediante rutinas, nutrición y acompañamiento.",
        resumen: "Ofrecemos herramientas, planes personalizados y contenido educativo para mejorar el rendimiento físico y el bienestar general.",
        icon: faBullseye,
      },
      {
        nombre: "Introducción",
        descripcion: "Bienvenido a tu espacio fitness, donde la disciplina, la constancia y la motivación se convierten en resultados.",
        resumen: "Nuestra plataforma está diseñada para ayudarte a lograr tus metas de salud y forma física con planes de entrenamiento, nutrición y seguimiento.",
        icon: faInfoCircle,
      },
      {
        nombre: "Historia",
        descripcion: "Nacimos con la idea de transformar vidas a través del fitness, el conocimiento y el compromiso personal.",
        resumen: "Desde nuestros inicios, hemos acompañado a cientos de personas a alcanzar sus objetivos físicos, adaptándonos a las nuevas tecnologías para brindar una experiencia completa.",
        icon: faHistory,
      }
];

const workoutRoomImages = [
  { nombre: "Visión", image: "https://wallpapersok.com/images/hd/fitness-muscular-man-rear-shot-o7hjg0p7g1afqd8t.jpg" },
  { nombre: "Misión", image: "https://e0.pxfuel.com/wallpapers/447/748/desktop-wallpaper-14-fitness-hp-background-ultra-gym-gym-workout.jpg" },
  { nombre: "Introducción", image: "https://c4.wallpaperflare.com/wallpaper/878/351/642/muscles-pose-back-arms-wallpaper-thumb.jpg" },
  { nombre: "Historia", image: "https://wallpapercave.com/wp/wp5885948.jpg" },
];

const workoutRoomsXImage = workoutRooms.map((workoutRoom) => ({
  ...workoutRoom,
  image: workoutRoomImages.find((image) => image.nombre === workoutRoom.nombre)?.image,
}));

const HomeScreen: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<WorkoutRoom | null>(null);
  const {state}=useAuth()
  console.log(state);
  
  const handleRoomClick = (workoutRoom: WorkoutRoom) => {
    setSelectedRoom(workoutRoom);
  };

  const closeModal = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="home-screen">
      <div className="welcome-section">
        <h1 className="welcome-title">BIENVENIDOS SPORT NUTRITION</h1>
        <p className="welcome-subtitle">
          MEJORA TUS HABITOS DE VIDA DESDE HOY.
        </p>
      </div>

      <h2 className="title">CONOCE MÁS DE NOSOTROS</h2>
      <div className="workout-rooms-container">
        {workoutRoomsXImage.map((workoutRoom) => (
          <div
            className="workout-room-card"
            key={workoutRoom.nombre}
            onClick={() => handleRoomClick(workoutRoom)}
          >
            <img src={workoutRoom.image} alt={workoutRoom.nombre} className="workout-room-image" />
            <div className="workout-room-info">
              <h3 className="workout-room-title">
                <FontAwesomeIcon icon={workoutRoom.icon} /> {workoutRoom.nombre.charAt(0).toUpperCase() + workoutRoom.nombre.slice(1)}
              </h3>
              <p className="workout-room-description">{workoutRoom.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ventana emergente para mostrar el resumen */}
            {selectedRoom && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedRoom.nombre}</h3> {/* Muestra el resumen en lugar del nombre */}
            <p>{selectedRoom.descripcion}</p> {/* Muestra la descripción en el cuerpo del modal */}
            <button onClick={closeModal} className="close-modal">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
