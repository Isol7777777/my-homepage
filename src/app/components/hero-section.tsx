import { ArrowDown } from 'lucide-react';

// 프로필 이미지 - public/profile.jpg 에 본인 사진 추가 후 '/profile.jpg' 로 변경 가능
const profileImage = '/profile.png';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 pt-32">
      <div className="max-w-6xl w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-foreground shadow-xl">
              <img
                src={profileImage}
                alt="프로필 사진"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative accent circle */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent rounded-full -z-10"></div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-4 py-2 bg-foreground border-2 border-primary rounded-full mb-6">
              <span className="text-primary">@이솔</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl mb-6">
              김소현
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground mb-8 leading-relaxed">
              "지속 가능한 도전을 추구합니다!"
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="px-6 py-3 rounded-lg border-2 border-foreground shadow-md
              bg-primary text-primary-foreground">
                PM
              </div>
              <div className="px-6 py-3 rounded-lg border-2 border-foreground shadow-md
              bg-accent text-accent-foreground">
                Branding
              </div>
              <div className="px-6 py-3 rounded-lg border-2 border-foreground shadow-md
              bg-secondary text-secondary-foreground">
                Developer
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-20 animate-bounce">
          <ArrowDown className="w-8 h-8 text-primary" />
        </div>
      </div>
    </section>
  );
}