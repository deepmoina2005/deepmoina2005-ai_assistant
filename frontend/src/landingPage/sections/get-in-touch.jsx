/* eslint-disable no-unused-vars */
import SectionTitle from "../components/section-title";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const GetInTouch = () => {

async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      access_key: "842a616a-6a31-4bec-882e-59d663ff6a5a",
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully!");
        form.reset();
      } else {
        toast.error("Failed to send message.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  }

  return (
    <section className="flex flex-col items-center py-16" id="contact">
      <SectionTitle 
        title="Get in touch" 
        description="Have a question or feedback? We'd love to hear from you." 
      />

      <form 
        onSubmit={handleSubmit} 
        className='grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto mt-16 w-full text-green-900'
      >
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          <label className='font-medium text-green-900'>Your Name</label>
          <input 
            name='name' 
            type="text" 
            placeholder='Enter your name' 
            required
            className='w-full mt-2 p-3 outline-none border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 transition bg-white text-green-900' 
          />
        </motion.div>

        <motion.div
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          <label className='font-medium text-green-900'>Email</label>
          <input 
            name='email' 
            type="email" 
            placeholder='Enter your email' 
            required
            className='w-full mt-2 p-3 outline-none border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 transition bg-white text-green-900' 
          />
        </motion.div>

        <motion.div className='sm:col-span-2'
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
        >
          <label className='font-medium text-green-900'>Message</label>
          <textarea 
            name='message' 
            rows={8} 
            placeholder='Enter your message' 
            required
            className='resize-none w-full mt-2 p-3 outline-none border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 transition bg-white text-green-900'
          />
        </motion.div>

        <motion.div 
          className="sm:col-span-2 flex justify-end mt-4"
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          <button 
            type='submit' 
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full'
          >
            Submit
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </motion.div>

      </form>
    </section>
  );
};

export default GetInTouch;
