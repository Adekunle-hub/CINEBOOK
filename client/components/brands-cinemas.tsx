
import CinemaCarousel from "./brands-carousel";

const Cinemas = () => {
  return (
    <main className="w-[95%] mx-auto ">
      <h4 className="text-2xl text-primary font-semibold">
        Our Partner Cinemas
      </h4>
      <p className="md:text-base text-sm">
        Book your seat seamlessly from your house in your preferred cinema, get hall, seat and a
        favourable cinema time, get to your cinema and collect your treats
      </p>
      <div className="overflow-hidden my-8">
       <CinemaCarousel/>
      </div>
    </main>
  );
};

export default Cinemas;
