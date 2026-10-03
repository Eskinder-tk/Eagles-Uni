import { ScrollReveal } from "@/app/Components/scroll-reveal";
import Image from "next/image";



const news = [
  {
    id: 1,
    image: "/news1.jpg",
    title: "New Academic Year Begins",
    text: "The university welcomes students for the new academic year.",
    detail: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat."
  },
  {
    id: 2,
    image: "/news2.jpg",
    title: "Admission Applications Open",
    text: "Applications for the upcoming semester are now available.",
    detail: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat."
  },
  {
    id: 3,
    image: "/news3.jpg",
    title: "Students Win Competition",
    text: "Our students achieved first place in a national competition.",
    detail: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat."
  },
  {
    id: 4,
    image: "/news4.jpg",
    title: "New Campus Facilities",
    text: "The university has opened new facilities for students.",
    detail: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat."
  },
  {
    id: 5,
    image: "/news5.jpg",
    title: "University Holds Annual Event",
    text: "Students and staff gathered for the university's annual event.",
    detail: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat."
  },
];

const newsPage =  async ({ params }: { params: Promise<{ id: number }> }) => {

    const {id} = await params
    
    const News = news.find(n => n.id == id)
    

    if (!News) {
        return <div>Something went wrong :/</div>
    }

    return (
        
            <article className="overflow-hidden rounded-xl my-5">
              <h3 className="text-xl font-bold text-center">{News.title}</h3>

              <div className="flex justify-around gap-24 mt-3 mb-5">

                <ScrollReveal direction="up" delay={0.3}>
                  <Image
                    src={News.image}
                    alt={News.title}
                    width={800}
                    height={679}
                    className="h-45 w-479 ml-10 object-cover"
                  />
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.5}>
                  <p className="ml-8 mr-5 text-gray-600 dark:text-gray-400">{News.detail}</p>
                </ScrollReveal>
                
                
              </div>
            </article>
        
    )
}

export default newsPage