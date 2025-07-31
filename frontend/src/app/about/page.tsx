import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О нас',
  description: 'Узнайте больше о платформе СтримКэш',
};

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  ArrowLeft,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  Star,
  CheckCircle,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  const stats = [
    { number: "2025", label: "Год основания", icon: <Calendar className="w-6 h-6" /> },
    { number: "2", label: "Активных стримеров", icon: <Users className="w-6 h-6" /> },
    { number: "10K+", label: "Донатов обработано", icon: <Heart className="w-6 h-6" /> },
    { number: "99.99%", label: "Uptime системы", icon: <Shield className="w-6 h-6" /> }
  ];

  const values = [
    {
      title: "Инновации",
      description: "Постоянно развиваем технологии для лучшего опыта стриминга",
      icon: <Zap className="w-8 h-8 text-yellow-400" />
    },
    {
      title: "Надежность",
      description: "Обеспечиваем стабильную работу платформы 24/7",
      icon: <Shield className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Сообщество",
      description: "Поддерживаем развитие стримерского сообщества в России",
      icon: <Users className="w-8 h-8 text-purple-400" />
    },
    {
      title: "Качество",
      description: "Создаем продукты, которыми гордимся и рекомендуем друзьям",
      icon: <Award className="w-8 h-8 text-pink-400" />
    }
  ];

  const team = [
    {
      name: "Михаил Вячеславович",
      role: "CEO & Основатель",
      description: "10+ лет в IT, 4 года в бизнесе",
      experience: "12 лет",
      expertise: ["Стратегия", "Управление", "Стриминг"]
    },
    {
      name: "Савелий Игоревич",
      role: "CTO",
      description: "Эксперт по микросервисам и высоконагруженным системам",
      experience: "8 лет",
      expertise: ["Архитектура", "DevOps", "Безопасность"]
    },
    {
      name: "Семён Олегович",
      role: "Звукорежиссёр/VFX дизайнер",
      description: "Специалист по звуку и визуалу",
      experience: "10 лет",
      expertise: ["Звукорежиссёр", "VFX дизайнер"]
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Основание компании",
      description: "Создание команды и разработка первой версии платформы"
    },
    {
      year: "2024",
      title: "Бета-тестирование",
      description: "Запуск закрытого бета-тестирования с первыми стримерами"
    },
    {
      year: "2025",
      title: "Публичный запуск",
      description: "Официальный запуск платформы для всех пользователей"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Button 
              variant="outline"
              onClick={() => router.back()}
              className="mb-8 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              О <span className="text-purple-400">СтримКэш</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Мы создаем лучшую платформу для донатов в России, помогая стримерам 
              монетизировать свой контент и развивать сообщество
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30">
            <Target className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Наша <span className="text-purple-400">миссия</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Сделать стриминг в России более доступным и прибыльным. Мы верим, что каждый 
              талантливый контент-мейкер заслуживает возможности зарабатывать на своем увлечении.
            </p>
            <p className="text-xl text-purple-300 mb-8 leading-relaxed">
              Мы хотим, чтобы стримеры зарабатывали больше — поэтому у нас комиссии ниже, чем у других сервисов: от 5% до 0% в зависимости от выбранного тарифа.
            </p>
            <p className="text-lg text-gray-400">
              СтримКэш — это не просто платформа для донатов, это инструмент для развития 
              стримерского сообщества и создания новых возможностей.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Наши <span className="text-purple-400">ценности</span>
            </h2>
            <p className="text-xl text-gray-400">
              Принципы, которые направляют нашу работу каждый день
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 text-center">
                  <div className="flex justify-center mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Наша <span className="text-purple-400">команда</span>
            </h2>
            <p className="text-xl text-gray-400 mb-4">
              Опытные специалисты, которые создают будущее стриминга
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden">
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Avatar with enhanced design */}
                  <div className="relative z-10 text-center mb-8">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full animate-pulse opacity-75"></div>
                      <div className="relative w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-4 border-gray-800 group-hover:border-purple-500/50 transition-all duration-300">
                        <span className="text-white text-3xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Name and role */}
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-purple-400 font-semibold text-lg mb-3">
                      {member.role}
                    </p>
                    
                    {/* Experience badge */}
                    <div className="inline-flex items-center px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4">
                      <span className="text-purple-300 text-sm font-medium">
                        {member.experience} опыта
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="relative z-10 mb-6">
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-center leading-relaxed">
                      {member.description}
                    </p>
                  </div>

                  {/* Expertise tags */}
                  <div className="relative z-10 mb-6">
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-700/50 border border-gray-600/50 rounded-full text-gray-300 text-sm font-medium group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-300 transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>



                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Team stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
              <div className="text-gray-400">Члена команды</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">26</div>
              <div className="text-gray-400">Лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">15+</div>
              <div className="text-gray-400">Навыков</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-400">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Наш <span className="text-purple-400">путь</span>
            </h2>
            <p className="text-xl text-gray-400">
              Ключевые этапы развития компании
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1 bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-12 border border-purple-500/30">
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Присоединяйтесь к <span className="text-purple-400">сообществу</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Станьте частью растущего сообщества стримеров и донатеров
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/register')}
                className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
              >
                Начать стримить
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/features')}
                className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <DollarSign className="w-8 h-8 text-purple-400 mr-2" />
                <span className="text-xl font-bold text-white">СтримКэш</span>
              </div>
              <p className="text-gray-400">
                Лучшая платформа для донатов в России
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-purple-400 transition-colors">Возможности</a></li>
                <li><a href="/pricing" className="hover:text-purple-400 transition-colors">Тарифы</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/documents" className="hover:text-purple-400 transition-colors">Юридическая информация</a></li>
                <li><a href="/help" className="hover:text-purple-400 transition-colors">Помощь</a></li>
                <li><a href="/status" className="hover:text-purple-400 transition-colors">Статус</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-purple-400 transition-colors">О нас</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 СтримКэш. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 