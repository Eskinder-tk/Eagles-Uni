import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollReveal } from "./scroll-reveal";

const items = [
  {
    value: "item-1",
    trigger: "How do I reset my password?",
    content:
      "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.",
  },
  {
    value: "item-2",
    trigger: "Can I change my subscription plan?",
    content:
      "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
  },
  {
    value: "item-3",
    trigger: "What payment methods do you accept?",
    content:
      "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
  },
]

const FAQ = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md lg:rounded-full p-6 mt-8 mb-8">
        <ScrollReveal direction="up" delay={0.3}>
          <h1 className="text-3xl font-bold text-center text-[#1a365d] dark:text-gray-300 mt-5">Frequently Asked Questions</h1>
        </ScrollReveal>
      
    
        <div className="flex flex-col items-center justify-center my-5">
            
            <Accordion defaultValue={["item-1"]} className="max-w-lg">
            {items.map((item, index) => (
              <ScrollReveal key={item.value} direction="up" delay={0.4 + index * 0.1}>
                <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
                <hr />
              </ScrollReveal>
              
            ))}
            </Accordion>
            
        
        </div>
        
    
    </div>

    
        
    
  )
}
export default FAQ
