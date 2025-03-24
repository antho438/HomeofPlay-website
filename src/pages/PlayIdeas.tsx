import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowLeft, Puzzle, Shapes, Palette, Rocket, Users, Leaf, BookOpen } from 'lucide-react';

export default function PlayIdeas() {
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
          <Lightbulb className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Creative Play Ideas
        </h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
          Maximize the educational value of our toys with these engaging activities
        </p>
      </div>

      {/* Play Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <Puzzle className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Indoor Activities</h2>
            <p className="text-gray-600 text-center mb-4">
              Creative ways to play inside on rainy days
            </p>
            <a href="#indoor" className="block text-center text-primary-600 font-medium hover:text-primary-700">
              View activities
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <Leaf className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Outdoor Adventures</h2>
            <p className="text-gray-600 text-center mb-4">
              Take learning and play into nature
            </p>
            <a href="#outdoor" className="block text-center text-primary-600 font-medium hover:text-primary-700">
              View activities
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-100 rounded-full p-3">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Group Play</h2>
            <p className="text-gray-600 text-center mb-4">
              Social activities for playdates and siblings
            </p>
            <a href="#group" className="block text-center text-primary-600 font-medium hover:text-primary-700">
              View activities
            </a>
          </div>
        </div>
      </div>

      {/* Indoor Activities Section */}
      <div id="indoor" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Puzzle className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">Indoor Activities</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Transform your living space into a learning laboratory with these creative indoor play ideas that use our rental toys.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sensory Bins</h3>
              <p className="text-gray-600 mb-4">
                Create themed sensory bins using household items and our toys to stimulate multiple senses and encourage exploration.
              </p>
              
              <div className="border-l-4 border-primary-200 pl-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials Needed:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Large plastic container</li>
                  <li>Base material (rice, dried beans, kinetic sand)</li>
                  <li>Small toys from our collection</li>
                  <li>Measuring cups, funnels, scoops</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">How To Play:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Fill the container with your base material.</li>
                  <li>Hide small toys throughout the bin.</li>
                  <li>Provide tools for scooping, pouring, and exploring.</li>
                  <li>Encourage children to find hidden objects and describe what they feel.</li>
                  <li>For older children, add a learning element by hiding letters, numbers, or themed objects related to what they're learning.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Indoor Obstacle Course</h3>
              <p className="text-gray-600 mb-4">
                Create a fun physical challenge using furniture, pillows, and our toys to develop gross motor skills and spatial awareness.
              </p>
              
              <div className="border-l-4 border-primary-200 pl-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials Needed:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Cushions and pillows</li>
                  <li>Hula hoops or rope circles</li>
                  <li>Building blocks for markers</li>
                  <li>Masking tape for lines</li>
                  <li>Tunnel or blanket over chairs</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">How To Play:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Design a course with different movements: crawling, jumping, balancing, etc.</li>
                  <li>Use masking tape to create lines to walk along.</li>
                  <li>Set up cushions to jump between like "lily pads."</li>
                  <li>Create a tunnel by draping a blanket over chairs.</li>
                  <li>Use building blocks as markers to weave around.</li>
                  <li>Time children as they complete the course and encourage them to beat their own time.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Story Box Theater</h3>
              <p className="text-gray-600 mb-4">
                Combine storytelling with creative play using our toys as characters in an imaginative narrative.
              </p>
              
              <div className="border-l-4 border-primary-200 pl-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials Needed:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Large cardboard box</li>
                  <li>Art supplies for decorating</li>
                  <li>Figurines and character toys</li>
                  <li>Props from around the house</li>
                  <li>Optional: small flashlight for lighting effects</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">How To Play:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Cut one side out of a large cardboard box to create a "stage."</li>
                  <li>Decorate the inside as a backdrop for your story.</li>
                  <li>Select character toys and props for your narrative.</li>
                  <li>Help children create a simple story with a beginning, middle, and end.</li>
                  <li>Encourage them to use different voices for different characters.</li>
                  <li>Perform the story for family members or record it as a keepsake.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outdoor Activities Section */}
      <div id="outdoor" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Leaf className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">Outdoor Adventures</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Take learning outside with these nature-based activities that incorporate our toys for a rich outdoor play experience.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Nature Scavenger Hunt</h3>
              <p className="text-gray-600 mb-4">
                Combine outdoor exploration with our toys for an educational adventure that develops observation skills and nature appreciation.
              </p>
              
              <div className="border-l-4 border-primary-200 pl-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials Needed:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Printed or hand-drawn scavenger hunt list</li>
                  <li>Small basket or bag for collecting</li>
                  <li>Magnifying glass</li>
                  <li>Nature guidebook or identification app</li>
                  <li>Character toys to "lead" the expedition</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">How To Play:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Create a list of items to find based on your location (park, backyard, trail).</li>
                  <li>Include items like "something smooth," "something that makes noise," or specific plants and insects.</li>
                  <li>Use character toys as "expedition leaders" who need help finding natural treasures.</li>
                  <li>Take photos of discoveries or collect non-living items in your basket.</li>
                  <li>Use the magnifying glass to examine findings more closely.</li>
                  <li>Create nature art or a journal entry with your discoveries afterward.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Outdoor Building Challenge</h3>
              <p className="text-gray-600 mb-4">
                Take construction toys outside to create structures that incorporate natural elements, developing engineering skills and creativity.
              </p>
              
              <div className="border-l-4 border-primary-200 pl-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials Needed:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Building blocks or construction sets</li>
                  <li>Natural materials (sticks, rocks, leaves)</li>
                  <li>String or twine</li>
                  <li>Measuring tools</li>
                  <li>Small figurines for scale</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">How To Play:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Challenge children to build a structure that combines toys with natural materials.</li>
                  <li>Suggest themes like "animal habitat," "fairy house," or "bridge across a stream."</li>
                  <li>Encourage problem-solving when structures don't work as planned.</li>
                  <li>Use small figurines to create stories around the structures.</li>
                  <li>Document the creations with photos before disassembling.</li>
                  <li>For older children, introduce concepts like stability, symmetry, and load-bearing.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Toy Safari</h3>
              <p className="text-gray-600 mb-4">
                Create an immersive outdoor adventure by taking animal figurines on a "safari" through your yard or local park.
              </p>
              
              <div className="border-l-4 border-primary-200 pl-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials Needed:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Animal figurines</li>
                  <li>Binoculars (real or homemade)</li>
                  <li>Camera or smartphone</li>
                  <li>Small notebook and pencil</li>
                  <li>Map of your "safari" area (can be hand-drawn)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">How To Play:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Create a simple map of your outdoor space, marking different "habitats."</li>
                  <li>Place animal figurines in appropriate habitats (water animals near puddles, etc.).</li>
                  <li>Equip children with binoculars and field notebooks.</li>
                  <li>Guide them on a safari tour, spotting animals and taking notes or photos.</li>
                  <li>Discuss what each animal eats, where it lives, and its special adaptations.</li>
                  <li>Create a safari journal afterward with drawings and observations.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Activities Section */}
      <div id="group" className="mb-16 scroll-mt-16">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-primary-700">Group Play Activities</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Foster social skills, cooperation, and friendly competition with these multi-player activities using our rental toys.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Collaborative Art Project</h3>
              <p className="text-gray-600 mb-4">
                Use art supplies and creative toys to develop a group masterpiece that teaches cooperation and creative problem-solving.
              </p>
              
              <div className="border-l-4 border-primary-200 pl-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials Needed:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Large paper or canvas</li>
                  <li>Various art supplies (paint, markers, collage materials)</li>
                  <li>Stamps, stencils, and texture tools</li>
                  <li>Smocks or old shirts to protect clothing</li>
                  <li>Theme or story prompt</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">How To Play:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Establish a theme or story for the artwork (underwater world, space adventure, etc.).</li>
                  <li>Assign each child a section or element to create.</li>
                  <li>Encourage children to plan how their sections will connect.</li>
                  <li>Allow each child to use different art techniques and materials.</li>
                  <li>Have regular "check-ins" where the group discusses how to integrate their work.</li>
                  <li>Display the finished artwork and have children present their contribution to the whole.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Toy Relay Races</h3>
              <p className="text-gray-600 mb-4">
                Combine physical activity with toy-based challenges for an energetic group game that builds teamwork and gross motor skills.
              </p>
              
              <div className="border-l-4 border-primary-200 pl-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials Needed:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Various toys for different challenges</li>
                  <li>Buckets or containers</li>
                  <li>Stopwatch or timer</li>
                  <li>Cones or markers for race lanes</li>
                  <li>Scoreboard</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">How To Play:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Divide children into teams of 2-4 players.</li>
                  <li>Set up stations with different toy-based challenges:
                    <ul className="list-disc list-inside ml-6 text-gray-600">
                      <li>Stack 5 blocks and then unstack them</li>
                      <li>Sort colored toys into matching buckets</li>
                      <li>Complete a simple puzzle</li>
                      <li>Dress a doll with specific clothing items</li>
                    </ul>
                  </li>
                  <li>Each team member completes one challenge before tagging the next player.</li>
                  <li>Teams earn points for speed and accuracy.</li>
                  <li>Rotate challenges so all children try each activity.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Toy Show and Tell</h3>
              <p className="text-gray-600 mb-4">
                Develop presentation skills and build confidence through a structured sharing activity centered around favorite toys.
              </p>
              
              <div className="border-l-4 border-primary-200 pl-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials Needed:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>A selection of toys (one per child)</li>
                  <li>Timer or hourglass</li>
                  <li>Question cards</li>
                  <li>Small stage area or special chair</li>
                  <li>Optional: microphone (real or pretend)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">How To Play:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Each child selects a toy they'd like to present.</li>
                  <li>Provide a simple structure for presentations:
                    <ul className="list-disc list-inside ml-6 text-gray-600">
                      <li>What is your toy called?</li>
                      <li>What can you do with it?</li>
                      <li>Why do you like it?</li>
                      <li>Show us something special about it</li>
                    </ul>
                  </li>
                  <li>Set a time limit appropriate for the children's ages (1-3 minutes).</li>
                  <li>After each presentation, allow other children to ask questions.</li>
                  <li>Encourage positive feedback after each presentation.</li>
                  <li>For younger children, an adult can interview them about their toy.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Activities */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Seasonal Play Ideas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Winter Wonder Play</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Create an indoor "snow" sensory bin with white rice and winter toys</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Build snow structures outside and decorate with colored water in spray bottles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Set up a pretend hot chocolate shop with play food sets</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Summer Splash Activities</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Create a water wall with recycled containers and water toys</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Set up a toy car wash station with soapy water and brushes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Freeze small toys in ice cubes for a melting rescue activity</span>
                </li>
              </ul>
            </div>
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
                  <BookOpen className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Learning Guides</h3>
              </div>
              <p className="text-gray-600">
                Age-appropriate toy guides to support your child's development at every stage.
              </p>
            </div>
          </Link>
          
          <Link to="/skill-development" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <Rocket className="h-5 w-5 text-primary-600" />
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

      {/* Parent Tips */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8">
        <div className="flex items-center mb-4">
          <Lightbulb className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-2xl font-bold text-primary-700">Parent Tips</h2>
        </div>
        
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Follow your child's lead:</strong> The most engaging play experiences often come from following your child's interests and curiosity.
          </p>
          <p>
            <strong>Rotate toys:</strong> Keep play fresh by rotating toys in and out of circulation. Our rental service makes this easy!
          </p>
          <p>
            <strong>Ask open-ended questions:</strong> Instead of "Do you like this toy?" try "What can you create with this?" or "What do you think happens next?"
          </p>
          <p>
            <strong>Allow for mess:</strong> Some of the best play experiences are messy. Prepare the space appropriately and embrace the creative chaos.
          </p>
          <p>
            <strong>Document play:</strong> Take photos or videos of your child's play adventures to revisit later and observe their development over time.
          </p>
        </div>
      </div>
    </div>
  );
}
