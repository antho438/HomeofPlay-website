import React from 'react';
import { Link } from 'react-router-dom';
import { Puzzle, ArrowLeft, Brain, Hand, Heart, MessageSquare, Zap, BarChart } from 'lucide-react';

export default function SkillDevelopment() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <Puzzle className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Skill Development Through Play
        </h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
          Learn how different toys help develop specific skills in children
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Science of Play</h2>
          <p className="text-gray-600 mb-4">
            Play is the primary way children learn about the world. Through carefully selected toys and activities, children develop crucial skills that form the foundation for future success in school and life.
          </p>
          <p className="text-gray-600">
            At The Home of Play, we carefully curate our toy collection to support development across five key domains: cognitive, physical, social-emotional, language, and creativity. Each toy in our collection is selected not just for fun, but for its developmental benefits.
          </p>
        </div>
      </div>

      {/* Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <a href="#cognitive" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <Brain className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Cognitive Skills</h2>
            <p className="text-gray-600 text-center">
              Problem-solving, memory, attention, and logical thinking
            </p>
          </div>
        </a>

        <a href="#physical" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <Hand className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Physical Skills</h2>
            <p className="text-gray-600 text-center">
              Fine and gross motor development, coordination, and spatial awareness
            </p>
          </div>
        </a>

        <a href="#social" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Social-Emotional Skills</h2>
            <p className="text-gray-600 text-center">
              Empathy, self-regulation, cooperation, and emotional intelligence
            </p>
          </div>
        </a>

        <a href="#language" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Language Skills</h2>
            <p className="text-gray-600 text-center">
              Vocabulary, communication, storytelling, and early literacy
            </p>
          </div>
        </a>

        <a href="#creativity" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Creativity</h2>
            <p className="text-gray-600 text-center">
              Imagination, innovation, artistic expression, and flexible thinking
            </p>
          </div>
        </a>
      </div>

      {/* Cognitive Skills Section */}
      <div id="cognitive" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Brain className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">Cognitive Skills</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Cognitive skills involve thinking, learning, and problem-solving. These skills help children understand the world around them and develop logical reasoning abilities.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Cognitive Skills Developed Through Play</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Problem-Solving</h4>
                <p className="text-gray-600">
                  The ability to identify challenges and find solutions through trial and error, analysis, and creative thinking.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Memory</h4>
                <p className="text-gray-600">
                  Recalling information, sequences, patterns, and experiences to apply to new situations.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Attention & Focus</h4>
                <p className="text-gray-600">
                  Concentrating on tasks, filtering distractions, and sustaining engagement with activities.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Logical Thinking</h4>
                <p className="text-gray-600">
                  Understanding cause and effect, making predictions, and developing reasoning skills.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Toys That Develop Cognitive Skills</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Puzzles</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop problem-solving strategies</li>
                      <li>Enhance visual-spatial awareness</li>
                      <li>Improve concentration and persistence</li>
                      <li>Teach part-to-whole relationships</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Building Blocks</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Foster spatial reasoning</li>
                      <li>Develop engineering concepts</li>
                      <li>Encourage planning and prediction</li>
                      <li>Teach balance and stability principles</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Memory Games</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Strengthen working memory</li>
                      <li>Develop visual discrimination</li>
                      <li>Improve attention to detail</li>
                      <li>Enhance recall abilities</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Pattern Games</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop sequential thinking</li>
                      <li>Introduce mathematical concepts</li>
                      <li>Enhance logical reasoning</li>
                      <li>Improve prediction skills</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Strategy Games</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop critical thinking</li>
                      <li>Encourage planning ahead</li>
                      <li>Teach consequence evaluation</li>
                      <li>Foster adaptive thinking</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Science Kits</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Encourage hypothesis testing</li>
                      <li>Develop observation skills</li>
                      <li>Introduce cause and effect</li>
                      <li>Foster curiosity and inquiry</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Physical Skills Section */}
      <div id="physical" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Hand className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">Physical Skills</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Physical skills involve both fine motor (small movements) and gross motor (large movements) development. These skills are essential for everything from writing to sports.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Physical Skills Developed Through Play</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Fine Motor Skills</h4>
                <p className="text-gray-600">
                  Small muscle movements that enable precise actions like grasping, manipulating small objects, and hand-eye coordination.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Gross Motor Skills</h4>
                <p className="text-gray-600">
                  Large muscle movements involving arms, legs, and the entire body for activities like running, jumping, and balancing.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Coordination</h4>
                <p className="text-gray-600">
                  The ability to use multiple body parts together smoothly and efficiently, often combining fine and gross motor skills.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Spatial Awareness</h4>
                <p className="text-gray-600">
                  Understanding where your body is in space and how it relates to other objects and people around you.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Toys That Develop Physical Skills</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Stacking & Nesting Toys</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop hand-eye coordination</li>
                      <li>Improve precision grasping</li>
                      <li>Teach size discrimination</li>
                      <li>Build finger strength and dexterity</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Threading & Lacing Activities</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Enhance fine motor precision</li>
                      <li>Develop bilateral coordination</li>
                      <li>Improve visual tracking</li>
                      <li>Build pre-writing skills</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Balance Boards & Beams</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop core strength</li>
                      <li>Improve equilibrium</li>
                      <li>Enhance body awareness</li>
                      <li>Build confidence in movement</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Ball Games</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop throwing and catching</li>
                      <li>Improve hand-eye coordination</li>
                      <li>Enhance spatial awareness</li>
                      <li>Build gross motor strength</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Art Supplies</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop pencil/crayon grip</li>
                      <li>Improve hand control and precision</li>
                      <li>Enhance finger strength</li>
                      <li>Build pre-writing skills</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Ride-On Toys</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop leg strength</li>
                      <li>Improve balance and coordination</li>
                      <li>Enhance spatial navigation</li>
                      <li>Build cardiovascular endurance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social-Emotional Skills Section */}
      <div id="social" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Heart className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">Social-Emotional Skills</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Social-emotional skills help children understand and manage emotions, build relationships, and develop empathy. These skills are crucial for mental health and social success.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Social-Emotional Skills Developed Through Play</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Emotional Regulation</h4>
                <p className="text-gray-600">
                  The ability to recognize, understand, and manage emotions in a healthy way, even during challenging situations.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Empathy</h4>
                <p className="text-gray-600">
                  Understanding others' feelings and perspectives, and responding with care and compassion.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Cooperation</h4>
                <p className="text-gray-600">
                  Working together with others toward shared goals, taking turns, sharing, and negotiating.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Self-Confidence</h4>
                <p className="text-gray-600">
                  Developing a positive self-image, resilience, and the courage to try new things and take appropriate risks.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Toys That Develop Social-Emotional Skills</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Dolls & Action Figures</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Encourage role-playing</li>
                      <li>Develop empathy and perspective-taking</li>
                      <li>Process real-life experiences</li>
                      <li>Practice caregiving behaviors</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Cooperative Games</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Teach turn-taking and sharing</li>
                      <li>Develop teamwork skills</li>
                      <li>Practice winning and losing gracefully</li>
                      <li>Build communication skills</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Puppets</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Express emotions safely</li>
                      <li>Practice social scenarios</li>
                      <li>Develop storytelling abilities</li>
                      <li>Build confidence in communication</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Pretend Play Sets</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Process real-world experiences</li>
                      <li>Practice social roles and norms</li>
                      <li>Develop negotiation skills</li>
                      <li>Build collaborative storytelling</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Emotion Games</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Identify and name feelings</li>
                      <li>Develop emotional vocabulary</li>
                      <li>Learn coping strategies</li>
                      <li>Practice emotional regulation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Social Scenario Cards</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Practice problem-solving</li>
                      <li>Develop conflict resolution skills</li>
                      <li>Build empathy through discussion</li>
                      <li>Learn appropriate social responses</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Skills Section */}
      <div id="language" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">Language Skills</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Language skills encompass listening, speaking, reading, and writing. These skills are fundamental for communication, learning, and social interaction.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Language Skills Developed Through Play</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Vocabulary Development</h4>
                <p className="text-gray-600">
                  Learning new words, their meanings, and how to use them appropriately in different contexts.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Expressive Language</h4>
                <p className="text-gray-600">
                  The ability to communicate thoughts, needs, and ideas verbally and through gestures and facial expressions.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Receptive Language</h4>
                <p className="text-gray-600">
                  Understanding what others are communicating through words, gestures, and expressions.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Narrative Skills</h4>
                <p className="text-gray-600">
                  Creating and understanding stories with a beginning, middle, and end, and sequencing events logically.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Toys That Develop Language Skills</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Picture Books</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Build vocabulary</li>
                      <li>Develop narrative understanding</li>
                      <li>Introduce print awareness</li>
                      <li>Foster a love of reading</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Storytelling Cards</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Enhance narrative creation</li>
                      <li>Develop sequential thinking</li>
                      <li>Improve descriptive language</li>
                      <li>Build creative expression</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Puppet Theaters</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Encourage dialogue creation</li>
                      <li>Practice different voices</li>
                      <li>Develop performance confidence</li>
                      <li>Build conversational skills</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Alphabet Toys</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Introduce letter recognition</li>
                      <li>Develop phonological awareness</li>
                      <li>Build early reading skills</li>
                      <li>Connect letters to sounds</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Rhyming Games</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop phonological awareness</li>
                      <li>Enhance sound discrimination</li>
                      <li>Build word family recognition</li>
                      <li>Prepare for reading success</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Pretend Play Props</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Encourage role-specific language</li>
                      <li>Develop conversational skills</li>
                      <li>Practice social language</li>
                      <li>Build vocabulary in context</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creativity Section */}
      <div id="creativity" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Zap className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">Creativity</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Creativity involves imagination, innovation, and the ability to think outside the box. These skills are increasingly valued in our rapidly changing world.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Creative Skills Developed Through Play</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Imagination</h4>
                <p className="text-gray-600">
                  The ability to form mental images and concepts not present in the immediate environment, creating new possibilities.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Divergent Thinking</h4>
                <p className="text-gray-600">
                  Generating multiple solutions to problems and thinking of many possible uses for objects.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Self-Expression</h4>
                <p className="text-gray-600">
                  Communicating thoughts, feelings, and ideas through various media and forms.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Innovation</h4>
                <p className="text-gray-600">
                  Creating new combinations of ideas, approaches, and materials to solve problems in novel ways.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Toys That Develop Creativity</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Open-Ended Art Supplies</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Encourage self-expression</li>
                      <li>Develop artistic techniques</li>
                      <li>Explore color, texture, and form</li>
                      <li>Build confidence in creation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Building Sets</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Foster 3D imagination</li>
                      <li>Develop design thinking</li>
                      <li>Encourage innovative solutions</li>
                      <li>Build spatial creativity</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Dress-Up Clothes</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Inspire character creation</li>
                      <li>Develop narrative imagination</li>
                      <li>Encourage role exploration</li>
                      <li>Build identity experimentation</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Musical Instruments</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Develop sound exploration</li>
                      <li>Encourage rhythm creation</li>
                      <li>Build auditory creativity</li>
                      <li>Foster musical expression</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Loose Parts</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Inspire unlimited combinations</li>
                      <li>Develop material repurposing</li>
                      <li>Encourage divergent thinking</li>
                      <li>Build problem-solving flexibility</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Invention Kits</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Foster engineering creativity</li>
                      <li>Develop innovative thinking</li>
                      <li>Encourage prototype creation</li>
                      <li>Build design iteration skills</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Development Chart */}
      <div className="bg-white rounded-xl shadow-md overflow hidden mb-12">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <BarChart className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">Skill Development by Age</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Different skills develop at different rates throughout childhood. This chart shows the typical progression of skill development and which toys are most beneficial at each stage.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Range</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Developmental Focus</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Toys</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0-12 months</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Sensory exploration</li>
                      <li>Cause and effect</li>
                      <li>Object permanence</li>
                      <li>Gross motor development</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Rattles and teethers</li>
                      <li>Soft blocks and balls</li>
                      <li>Activity gyms</li>
                      <li>Simple musical toys</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1-3 years</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Language acquisition</li>
                      <li>Fine motor skills</li>
                      <li>Symbolic thinking</li>
                      <li>Independence</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Shape sorters</li>
                      <li>Simple puzzles</li>
                      <li>Push and pull toys</li>
                      <li>Beginning pretend play sets</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3-5 years</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Social skills</li>
                      <li>Imaginative play</li>
                      <li>Pre-academic concepts</li>
                      <li>Emotional regulation</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Dress-up clothes</li>
                      <li>Building blocks</li>
                      <li>Art supplies</li>
                      <li>Simple board games</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">6-8 years</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Reading and writing</li>
                      <li>Logical thinking</li>
                      <li>Friendship skills</li>
                      <li>Rule-following</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Construction sets</li>
                      <li>Strategy games</li>
                      <li>Science kits</li>
                      <li>Sports equipment</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">9-12 years</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Critical thinking</li>
                      <li>Specialized interests</li>
                      <li>Self-identity</li>
                      <li>Complex social dynamics</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      <li>Advanced building sets</li>
                      <li>Complex games</li>
                      <li>Hobby and craft kits</li>
                      <li>Coding and robotics toys</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/learning-guides" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <Brain className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Learning Guides</h3>
              </div>
              <p className="text-gray-600">
                Age-appropriate toy guides to support your child's development at every stage.
              </p>
            </div>
          </Link>
          
          <Link to="/play-ideas" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <Zap className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Play Ideas</h3>
              </div>
              <p className="text-gray-600">
                Creative activities and play suggestions to maximize the educational value of our toys.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Expert Advice */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8">
        <div className="flex items-center mb-4">
          <Brain className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-2xl font-bold text-primary-700">Expert Advice</h2>
        </div>
        
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Balance is key:</strong> Ensure your child has access to toys that develop all skill areas, not just those they naturally gravitate toward.
          </p>
          <p>
            <strong>Follow developmental readiness:</strong> Choose toys that are slightly challenging but not frustrating. The "zone of proximal development" is where the most learning happens.
          </p>
          <p>
            <strong>Quality over quantity:</strong> A few well-chosen, open-ended toys often provide more developmental benefits than many single-purpose toys.
          </p>
          <p>
            <strong>Your presence matters:</strong> While toys are valuable tools, your interaction, conversation, and play alongside your child amplifies their developmental benefits.
          </p>
          <p>
            <strong>Observe and adapt:</strong> Pay attention to how your child engages with different toys and adjust your selections based on their interests, strengths, and areas for growth.
          </p>
        </div>
      </div>
    </div>
  );
}
