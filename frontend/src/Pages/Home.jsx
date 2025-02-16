import { toast } from "@/components/ui/use-toast";
import { logout, selectUser } from "@/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUser);

  return (
    <div className="w-full flex justify-center items-center flex-col gap-5 p-8">
      {/* Header Text */}
      <h1 className="text-4xl font-bold text-center mt-8">
        Welcome to Echo Gesture, where communication goes beyond words!
      </h1>

      {/* Main Description */}
      <p className="text-xl text-gray-700 text-center max-w-3xl leading-8 mt-4">
        Our platform is dedicated to bridging the gap between spoken language and the vibrant world of sign language. By seamlessly converting text into sign language, we empower individuals to connect, share, and express themselves with greater accessibility and inclusivity.
      </p>

      {/* Additional Content */}
      <p className="text-xl text-gray-700 text-center max-w-3xl leading-8 mt-4">
        Whether you're looking to enhance your communication skills or support a more connected community, Echo Gesture is here to bring every conversation to life through the art of signing. Join us in breaking barriers and embracing a more inclusive world of communication!
      </p>

      {/* Redirect Button */}
      <div className="flex justify-center mt-6">
        <a 
          href="main.html" // Adjust the path if necessary
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition duration-300"
        >
          Go to Main Page
        </a>
      </div>
    </div>
  );
}
