import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, GraduationCap, Brain, Baby, Shield as Child, School } from 'lucide-react';

export default function LearningGuides() {
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
          <BookOpen className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Learning Guides
        </h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
          Age-appropriate toy guides to support your child's development at every stage
        </p>
      </div>

      {/* Age Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <Baby className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">0-2 Years</h2>
            <p className="text-gray-600 text-center mb-4">
              Sensory exploration and early development toys
            </p>
            <a href="#infant" className="block text-center text-primary-600 font-medium hover:text-primary-700">
              View guides
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <Child className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">3-5 Years</h2>
            <p className="text-gray-600 text-center mb-4">
              Imaginative play and pre-school learning toys
            </p>
            <a href="#preschool" className="block text-center text-primary-600 font-medium hover:text-primary-700">
              View guides
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <School className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">6+ Years</h2>
            <p className="text-gray-600 text-center mb-4">
              Problem-solving and advanced learning toys
            </p>
            <a href="#school-age" className="block text-center text-primary-600 font-medium hover:text-primary-700">
              View guides
            </a>
          </div>
        </div>
      </div>

      {/* Infant Section */}
      <div id="infant" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Baby className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">0-2 Years: Sensory Development</h2>
          </div>
          <p className="text-gray-700 mb-4">
            During the first two years, babies learn primarily through their senses. Toys that stimulate touch, sight, hearing, and movement are essential for their development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recommended Toys</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Soft Blocks:</strong> Safe for mouthing and easy to grasp, helping develop fine motor skills.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Stacking Rings:</strong> Teaches size discrimination and hand-eye coordination.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Sensory Balls:</strong> Different textures stimulate tactile development.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Simple Puzzles:</strong> Large, chunky pieces for developing problem-solving skills.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Musical Toys:</strong> Introduce cause and effect while stimulating auditory development.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Developmental Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Sensory Processing:</strong> Learning to interpret information from their senses.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Fine Motor Skills:</strong> Grasping, reaching, and manipulating objects.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Gross Motor Skills:</strong> Rolling, sitting, crawling, and eventually walking.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Cognitive Development:</strong> Understanding object permanence and cause-effect relationships.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Language Development:</strong> Responding to sounds and beginning to form words.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Play Tips for Parents</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Narrate your actions and name objects to build vocabulary.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Allow for free exploration with supervision.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Rotate toys regularly to maintain interest and provide new challenges.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Join in play to model social interaction and language.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Follow your baby's lead and interests rather than directing play.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preschool Section */}
      <div id="preschool" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Child className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">3-5 Years: Imagination & Creativity</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Preschoolers are developing their imagination and social skills. Toys that encourage pretend play, creativity, and basic academic concepts support this crucial stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recommended Toys</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Building Blocks:</strong> Wooden blocks for constructive play and spatial awareness.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Dress-Up Clothes:</strong> Costumes and props for role-playing and social development.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Art Supplies:</strong> Crayons, clay, and paper for creative expression.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Puzzles:</strong> More complex puzzles with 10-20 pieces for problem-solving.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Board Games:</strong> Simple games that teach turn-taking and following rules.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Developmental Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Social Skills:</strong> Learning to share, take turns, and cooperate with others.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Emotional Development:</strong> Understanding and expressing feelings through play.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Language Skills:</strong> Expanding vocabulary and narrative abilities.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Pre-Math Skills:</strong> Counting, sorting, and recognizing patterns.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Pre-Literacy:</strong> Letter recognition and storytelling abilities.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Play Tips for Parents</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Ask open-ended questions to encourage creative thinking.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Create a dedicated space for messy play like painting and clay.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Arrange playdates to develop social skills with peers.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Incorporate counting and letter recognition into everyday play.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Allow for unstructured play time to foster independence and creativity.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* School Age Section */}
      <div id="school-age" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <School className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">6+ Years: Problem-Solving & Skill Building</h2>
          </div>
          <p className="text-gray-700 mb-4">
            School-age children are ready for more complex challenges. Toys that develop specific skills, encourage teamwork, and build confidence are ideal for this age group.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recommended Toys</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Construction Sets:</strong> More complex building toys that teach engineering concepts.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Science Kits:</strong> Age-appropriate experiments that introduce scientific principles.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Strategy Games:</strong> Chess, checkers, and other games that develop critical thinking.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Craft Kits:</strong> More advanced art projects that build patience and fine motor skills.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Coding Toys:</strong> Introduction to programming concepts through play.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Developmental Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Critical Thinking:</strong> Analyzing situations and solving complex problems.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Teamwork:</strong> Collaborating with others toward common goals.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Perseverance:</strong> Developing patience and persistence through challenges.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Academic Skills:</strong> Reinforcing math, reading, and science concepts.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Self-Direction:</strong> Taking initiative and working independently.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Play Tips for Parents</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Encourage children to complete projects even when they become challenging.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Balance screen time with hands-on activities and outdoor play.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Allow children to take the lead in choosing and directing activities.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Use family game nights to build social skills and create memories.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Connect play to real-world applications and future careers.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Expert Advice Section */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8 mb-12">
        <div className="flex items-center mb-4">
          <GraduationCap className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-2xl font-bold text-primary-700">Expert Advice</h2>
        </div>
        <blockquote className="italic text-gray-700 mb-4">
          "Play is often talked about as if it were a relief from serious learning. But for children, play is serious learning. Play is really the work of childhood."
        </blockquote>
        <p className="text-right text-gray-600">- Fred Rogers</p>
        
        <div className="mt-6">
          <p className="text-gray-700 mb-4">
            Our learning guides are developed in consultation with child development specialists and early childhood educators. We believe in the power of play-based learning and carefully select toys that support multiple developmental domains simultaneously.
          </p>
          <p className="text-gray-700">
            Remember that every child develops at their own pace. These guides are suggestions based on typical developmental milestones, but your child's individual interests and abilities should always guide your toy selections.
          </p>
        </div>
      </div>

      {/* Related Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/play-ideas" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <Brain className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Play Ideas</h3>
              </div>
              <p className="text-gray-600">
                Creative activities and play suggestions to maximize the educational value of our toys.
              </p>
            </div>
          </Link>
          
          <Link to="/skill-development" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <GraduationCap className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Skill Development</h3>
              </div>
              <p className="text-gray-600">
                Learn how different toys help develop specific skills like motor coordination, problem-solving, and creativity.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
