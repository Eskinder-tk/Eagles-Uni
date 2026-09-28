import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { GraduationCap, Layers, Users } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ScrollReveal } from "./scroll-reveal";
import Counter from "./Counter";



const Stat = () => {
    return (
        <div className="bg-white  dark:bg-gray-800 shadow-md lg:rounded-e-full p-6 mt-8 mb-8">

                <div className="flex flex-wrap items-center justify-center gap-9 pr-9 pl-0 pb-9 pt-1 mt-1 ">
            
                <ScrollReveal className="w-full sm:w-[30%] lg:w-[20%]" direction="up" delay={0.4}>
                    <Card className="flex w-full flex-col items-center justify-center h-auto shadow-md bg-[#3b6e99] text-white">                                                                         
                        <CardContent className="flex flex-col justify-center items-center">
                            <GraduationCap className="mb-2"/>
                            <Counter  target={437} />
                            <p>Students</p>
                        </CardContent>                   
                    </Card>
                </ScrollReveal>
                
                
                <ScrollReveal className="w-full sm:w-[30%] lg:w-[20%]" direction="up" delay={0.6}>
                    <Card className="flex w-full flex-col items-center justify-center h-auto shadow-md bg-[#3b6e99] text-white">                       
                        <CardContent className="flex flex-col justify-center items-center">
                            <Layers className="mb-2"/>
                            <Counter  target={40} />
                            <p>Courses</p>
                        </CardContent>                  
                    </Card>
                </ScrollReveal>

                    
                <ScrollReveal className="w-full sm:w-[30%] lg:w-[20%]" direction="up" delay={0.8}>
                    <Card className="flex w-full flex-col items-center justify-center h-auto shadow-md bg-[#3b6e99] text-white">                                            
                        <CardContent className="flex flex-col justify-center items-center">
                            <Users className="mb-2"/>
                            <Counter target={20} />
                            <p>Teachers</p>
                        </CardContent>                   
                    </Card>
                </ScrollReveal>    


                <ScrollReveal direction="up" delay={0.2} className="flex items-start justify-center">
      
                    <DotLottieReact
                        src="/Growing_graph.json" // or CDN link
                        loop
                        autoplay
                        className="w-full max-w-95 ml-auto mr-auto mb-14  pb-0 h-auto object-contain"
                    />
                </ScrollReveal>


                </div>
            
        </div>
        
    )
}

export default Stat