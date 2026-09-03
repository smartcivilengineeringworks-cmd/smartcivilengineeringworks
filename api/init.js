import { sql } from './db.js';
import bcrypt from 'bcryptjs';

const initialProjects = [
  {
    id: 1,
    title: 'RDIS Muhanga Office',
    category: 'Commercial',
    description: 'Commercial / Office Building',
    image_url: '/projects/RDIS Muhanga Office — Commercial  Office Building.png',
    year: '2019',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Muhanga, Rwanda',
    model: 'Design, Build & Supervision',
    scope: 'Structural execution, masonry work, floor slab engineering, plumbing systems, and premium office finishes.'
  },
  {
    id: 2,
    title: 'Nyabyondo Commercial Building',
    category: 'Commercial',
    description: 'Commercial Building',
    image_url: '/projects/Nyabyondo Commercial Building — Commercial Building.png',
    year: '2020',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kigali, Rwanda',
    model: 'Detailed Design & Structural Calculations',
    scope: 'Concept layout, 3D visualization modeling, structural stability analysis, and municipality permit documents.'
  },
  {
    id: 3,
    title: 'Muyumbu TVET',
    category: 'Educational',
    description: 'Educational Infrastructure Classroom Blocks',
    image_url: '/projects/Muyumbu TVET — Educational Infrastructure.png',
    year: '2021',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Muyumbu, Rwanda',
    model: 'Structural Design & Site Supervision',
    scope: 'Complete structural modeling of three-storey classroom blocks, reinforced concrete calculations, and on-site QA/QC controls.'
  },
  {
    id: 4,
    title: 'G+1 Residential House',
    category: 'Residential',
    description: 'Modern G+1 Residential Building',
    image_url: '/projects/G+1 Residential House — Residential Building.png',
    year: '2018',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kicukiro, Kigali',
    model: 'Design & Construction Supervision',
    scope: 'Detailed architectural drawing, interior partition layout, electrical piping installation, and external paving.'
  },
  {
    id: 5,
    title: 'G+1 Residential House (Modern)',
    category: 'Residential',
    description: 'High-end G+1 Residential Building',
    image_url: '/projects/G+1 Residential House — Residential Building (2).png',
    year: 'Ongoing',
    status: 'Ongoing',
    progress: 80,
    progress_stage: 'Execution & Supervision Phase',
    location: 'Nyarugenge, Kigali',
    model: 'Design, Build & Supervision',
    scope: 'Feasibility studies, structural design checks, reinforced concrete frame execution, and premium cladding finishing.'
  },
  {
    id: 6,
    title: 'Kirehe Gymnasium Structural Design',
    category: 'Structural',
    description: 'Large span structural engineering design',
    image_url: '/projects/Structural Design of Kirehe Gymnasium — Structural Engineering.png',
    year: '2022',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kirehe, Eastern Province',
    model: 'Structural Auditing & Design Consultancy',
    scope: 'Designing large-span structural steel roof trusses, foundations loading parameters, and wind shear calculations.'
  },
  {
    id: 7,
    title: 'G+1 Residential Houses (Rebero)',
    category: 'Residential',
    description: 'G+1 Residential Development Estate',
    image_url: '/projects/G+1 Residential Houses (Rebero Village) — Residential Development.png',
    year: '2025',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Rebero, Kigali',
    model: 'Full Architecture, Planning & Supervision',
    scope: 'Master plan coordinates, infrastructure layout, individual villa designs, and building supervision.'
  },
  {
    id: 8,
    title: 'Busogo Petrol Station',
    category: 'Infrastructure',
    description: 'Commercial / Industrial Fuel Station Block',
    image_url: '/projects/Busogo Petrol Station — Commercial and Industrial.png',
    year: '2021',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Busogo, Rwanda',
    model: 'Design, Build & Supervision',
    scope: 'Hydraulic and safety hazard design, concrete containment slab engineering, utility infrastructure, and service shop design.'
  },
  {
    id: 9,
    title: 'Busanza Commercial House',
    category: 'Commercial',
    description: 'Multi-storey Commercial Building',
    image_url: '/projects/Busanza Commercial House — Commercial Building.png',
    year: '2024',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kanombe, Kigali',
    model: 'Detailed Design & Site Supervision',
    scope: 'Complete structural concrete framework design, staircases design, fire safety permit files, and drainage systems.'
  },
  {
    id: 10,
    title: 'G+1 Residential House (A)',
    category: 'Residential',
    description: 'Family G+1 Residential Building',
    image_url: '/projects/G+1 Residential House — Residential Building (3).png',
    year: '2018',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Nyarugenge, Kigali',
    model: 'General Construction Supervision',
    scope: 'Excavation management, concrete footings supervision, bricklaying control, and structural steel reinforcement checks.'
  },
  {
    id: 11,
    title: 'G+1 Residential House (B)',
    category: 'Residential',
    description: 'Modern Design G+1 House',
    image_url: '/projects/G+1 Residential House — Residential Building (4).png',
    year: '2019',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Gisozi, Kigali',
    model: 'Design & Build',
    scope: 'Soil tests, conceptual layout planning, 3D renderings, foundation sizing, masonry walls, and interior finishes.'
  },
  {
    id: 12,
    title: 'G+2 Residential House (A)',
    category: 'Residential',
    description: 'G+2 Residential Building',
    image_url: '/projects/G+2 Residential House — Residential Building.png',
    year: '2020',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kicukiro, Kigali',
    model: 'Structural Calculations & Supervision',
    scope: 'Multi-storey concrete column sizing, reinforced floor slabs, steel stairs, and plumbing distribution supervision.'
  },
  {
    id: 13,
    title: 'G+2 Residential House (B)',
    category: 'Residential',
    description: 'G+2 Residential Building',
    image_url: '/projects/G+2 Residential House — Residential Building (2).png',
    year: '2020',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Remera, Kigali',
    model: 'Design, Build & Supervision',
    scope: 'Initial land topo surveys, structural blueprints design, brickwork, plastering, interior tiling, and paint work.'
  },
  {
    id: 14,
    title: 'G+2 Residential House (C)',
    category: 'Residential',
    description: 'G+2 Residential Building',
    image_url: '/projects/G+2 Residential House — Residential Building (3).png',
    year: '2021',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kigarama, Kigali',
    model: 'Detailed Design & Structural Checks',
    scope: 'Drafting columns layout, shear walls calculations, utility mapping, and submitting permit files to local construction registries.'
  },
  {
    id: 15,
    title: 'G+2 Residential House (D)',
    category: 'Residential',
    description: 'G+2 Residential Building',
    image_url: '/projects/G+2 Residential House.png',
    year: '2021',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kabeza, Kigali',
    model: 'Construction supervision & Quality control',
    scope: 'Concrete slump checks, cube crash testing reports, rebar details compliance, and electrical wiring audits.'
  },
  {
    id: 16,
    title: 'G+1 Twin Residential House',
    category: 'Residential',
    description: 'Twin Residential Development',
    image_url: '/projects/G+1 Twin Residential House — Residential Development.png',
    year: '2022',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Nyarutarama, Kigali',
    model: 'Design & Construction Supervision',
    scope: 'Combined footings design, firewall partitions structural calculations, MEP systems routing, and exterior finishing.'
  },
  {
    id: 17,
    title: 'Musanze Mixed Use Complex',
    category: 'Commercial',
    description: 'Mixed Use Commercial / Residential Development',
    image_url: '/projects/Musanze Mixed Use Complex — Mixed Use Development.png',
    year: '2022',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Musanze, Northern Province',
    model: 'Design, Build & Supervision',
    scope: 'Musanze mixed use structural execution, foundation load sizing, slope retaining wall blueprints, and construction.'
  },
  {
    id: 18,
    title: 'G+1 Residential House (Bruno)',
    category: 'Residential',
    description: 'G+1 Residential Building for Bruno',
    image_url: '/projects/G+1 Residential House for Bruno — Residential Building.png',
    year: '2021',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kicukiro, Kigali',
    model: 'Detailed Design & Structural Calculations',
    scope: 'Full conceptual blueprints, structural calculations, and permit files coordination.'
  },
  {
    id: 19,
    title: 'G+1 Residential House (3 Tigers)',
    category: 'Residential',
    description: 'G+1 Residential Building for 3 Tigers',
    image_url: '/projects/G+1 Residential House for 3 Tigers — Residential Building.png',
    year: '2021',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Gasabo, Kigali',
    model: 'Design, Build & Supervision',
    scope: 'Turnkey residential package, site excavation, retaining walls design, reinforced concrete structural frame, and high-end gypsum ceiling board finishes.'
  },
  {
    id: 20,
    title: 'G+3 Residential Apartment',
    category: 'Residential',
    description: 'G+3 Multi-storey Apartment Building',
    image_url: '/projects/G+3 Residential Apartment — Residential  Multi-storey.png',
    year: '2022',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kibagabaga, Kigali',
    model: 'Detailed Design & Structural Calculations',
    scope: 'Shear wall seismic calculations, foundations loading designs, underground stormwater storage design, and permit approvals.'
  },
  {
    id: 21,
    title: 'G+1 Residential House (C)',
    category: 'Residential',
    description: 'Modern G+1 Residential Building',
    image_url: '/projects/G+1 Residential House — Residential Building.png',
    year: '2019',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kicukiro, Kigali',
    model: 'General Construction Supervision',
    scope: 'Reinforced concrete slab check, column vertical alignment inspection, and waterproofing system supervision for wet areas.'
  },
  {
    id: 22,
    title: 'G+1 Residential House (D)',
    category: 'Residential',
    description: 'G+1 Residential Building',
    image_url: '/projects/G+1 Residential House — Residential Building (2).png',
    year: '2019',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Gasabo, Kigali',
    model: 'Design & Construction',
    scope: 'Architectural drawings, boundary walls masonry execution, roofing installation, plumbing fixtures, and painting works.'
  },
  {
    id: 23,
    title: 'Rebero Commercial Building',
    category: 'Commercial',
    description: 'Rebero Commercial Building for Sentabyo',
    image_url: '/projects/Rebero Commercial Building for Sentabyo — Commercial Building.png',
    year: '2022',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Rebero, Kigali',
    model: 'Detailed Design & Structural Checks',
    scope: 'Detailed structural design of multi-storey commercial frame, parking retaining wall design, and permit applications.'
  },
  {
    id: 24,
    title: 'G+2 Residential House (E)',
    category: 'Residential',
    description: 'G+2 Residential Building',
    image_url: '/projects/G+2 Residential House (2).png',
    year: '2020',
    status: 'Completed',
    progress: 100,
    progress_stage: 'Completed & Handed Over',
    location: 'Kabeza, Kigali',
    model: 'Design, Build & Supervision',
    scope: 'Feasibility studies, structural checks, foundations concrete castings, brickwork, plastering, interior and exterior cladding.'
  }
];

export async function initDatabase() {
  console.log('Initializing Neon PostgreSQL database tables...');

  // 1. Create admin_users table
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(100) DEFAULT 'Company Administrator',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('✓ admin_users table ready.');

  // 2. Create default admin if not exists
  const existingAdmin = await sql`SELECT id FROM admin_users WHERE username = 'admin' LIMIT 1;`;
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash('SmartCivil@2026!', 10);
    await sql`
      INSERT INTO admin_users (username, password_hash, full_name)
      VALUES ('admin', ${passwordHash}, 'Smart Civil Manager');
    `;
    console.log('✓ Created default administrator: username="admin", password="SmartCivil@2026!"');
  } else {
    console.log('✓ Admin user already exists.');
  }

  // 3. Create projects table
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      image_url TEXT,
      year VARCHAR(50),
      status VARCHAR(50) DEFAULT 'Completed',
      progress INTEGER DEFAULT 100,
      progress_stage VARCHAR(100) DEFAULT 'Completed',
      location VARCHAR(255),
      model VARCHAR(255),
      scope TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('✓ projects table ready.');

  // 4. Create inquiries table
  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(100),
      subject VARCHAR(255),
      message TEXT,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('✓ inquiries table ready.');

  // 5. Seed initial projects if empty
  const projectCount = await sql`SELECT count(*) as count FROM projects;`;
  if (Number(projectCount[0].count) === 0) {
    console.log(`Seeding ${initialProjects.length} initial projects...`);
    for (const p of initialProjects) {
      await sql`
        INSERT INTO projects (
          title, category, description, image_url, year, status, progress, progress_stage, location, model, scope
        ) VALUES (
          ${p.title}, ${p.category}, ${p.description}, ${p.image_url}, ${p.year}, ${p.status}, ${p.progress}, ${p.progress_stage}, ${p.location}, ${p.model}, ${p.scope}
        );
      `;
    }
    console.log(`✓ Successfully seeded ${initialProjects.length} projects into Neon database!`);
  } else {
    console.log(`✓ Projects table already has ${projectCount[0].count} records.`);
  }

  return { success: true, message: 'Database initialization complete.' };
}

// Allow direct execution from CLI
if (process.argv[1]?.endsWith('init.js')) {
  initDatabase()
    .then((res) => {
      console.log(res.message);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}
