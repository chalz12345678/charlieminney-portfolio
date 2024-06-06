import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`I am a second-year undergraduate Mechanical Engineering student at Northeastern University (Boston, MA). I've always loved engineering and creating little projects. This has ranged anywhere from a first-person-view drone to transforming shoes. I'd love to use my passion for engineering, design, and programming to construct technology that makes a real impact.
          In addition to my academic pursuits, I enjoy engaging in activities that challenge and inspire me. Outside of my studies, I love spending time with my dog, practicing drawing, connecting with nature through hiking and traveling, exploring gratitude through community service, and finding peace through rowing.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
