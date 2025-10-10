#!/usr/bin/env node

/**
 * TechShu Boilerplates CLI - Interactive & User-Friendly
 *
 * Created by: Indranil Banerjee
 * Title: Head of AI Transformation, INT TechShu
 * LinkedIn: https://in.linkedin.com/in/askneelnow
 * Email: hi@indranil.in
 * Work: indranil.banerjee@intglobal.com
 *
 * © 2025 TechShu - All Rights Reserved
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

const REGISTRY_URL = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json';
const BASE_URL = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main';

interface Boilerplate {
  id: string;
  name: string;
  category: string;
  version: string;
  description: string;
  tags: string[];
  files: number;
  components?: number;
  lib?: number;
  path: string;
  dependencies: string[];
}

interface Registry {
  boilerplates: Boilerplate[];
  version: string;
  name: string;
}

// Helper function to show welcome banner
function showWelcomeBanner() {
  console.log('');
  console.log(chalk.bold.cyan('╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('           🚀 TechShu Boilerplates CLI v1.2.0            ') + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════╝'));
  console.log('');
  console.log(chalk.gray('  42 Production-Ready Next.js + Supabase Boilerplates'));
  console.log(chalk.gray('  Save 28 minutes per boilerplate • 95% fewer errors'));
  console.log('');
  console.log(chalk.gray('  Created by: ') + chalk.cyan('Indranil Banerjee'));
  console.log(chalk.gray('  LinkedIn: ') + chalk.blue('https://in.linkedin.com/in/askneelnow'));
  console.log('');
}

// Helper function to show success message
function showSuccessMessage(message: string) {
  console.log('');
  console.log(chalk.green('✓ ') + chalk.bold.green(message));
  console.log('');
}

// Helper function to show error message
function showErrorMessage(message: string) {
  console.log('');
  console.log(chalk.red('✗ ') + chalk.bold.red(message));
  console.log('');
}

// Helper function to show tip
function showTip(message: string) {
  console.log('');
  console.log(chalk.yellow('💡 Tip: ') + chalk.gray(message));
  console.log('');
}

const program = new Command();

program
  .name('techshu')
  .description('Interactive CLI to fetch TechShu boilerplates and components\nCreated by Indranil Banerjee - Head of AI Transformation, INT TechShu')
  .version('1.2.0')
  .hook('preAction', () => {
    // Show banner before any command
    if (process.argv.length > 2 && !process.argv.includes('--help') && !process.argv.includes('-h')) {
      showWelcomeBanner();
    }
  });

// Show author info on help
program.on('--help', () => {
  console.log('')
  console.log(chalk.bold.cyan('Examples:'))
  console.log(chalk.gray('  $ techshu browse              ') + chalk.dim('# Interactive mode'))
  console.log(chalk.gray('  $ techshu list                ') + chalk.dim('# List all boilerplates'))
  console.log(chalk.gray('  $ techshu search auth         ') + chalk.dim('# Search for auth-related'))
  console.log(chalk.gray('  $ techshu add authentication  ') + chalk.dim('# Add authentication'))
  console.log('')
  console.log(chalk.bold.cyan('Created by:'))
  console.log(chalk.cyan('  Indranil Banerjee'))
  console.log(chalk.gray('  Head of AI Transformation, INT TechShu'))
  console.log(chalk.gray('  LinkedIn: https://in.linkedin.com/in/askneelnow'))
  console.log('')
});

// Interactive browse mode
program
  .command('browse')
  .description('🎯 Interactive mode - Browse and add boilerplates')
  .action(async () => {
    try {
      const spinner = ora('Loading boilerplates...').start();
      const { data } = await axios.get<Registry>(REGISTRY_URL);
      spinner.succeed(chalk.green('✓ Loaded 42 boilerplates!'));

      // Main interactive loop
      let continueSession = true;
      while (continueSession) {
        console.log('');
        console.log(chalk.bold.cyan('📦 What would you like to do?'));
        console.log('');

        const { action } = await inquirer.prompt([{
          type: 'list',
          name: 'action',
          message: 'Choose an action:',
          choices: [
            { name: '🔍 Browse by category', value: 'browse' },
            { name: '🔎 Search boilerplates', value: 'search' },
            { name: '📋 View all boilerplates', value: 'list' },
            { name: '❌ Exit', value: 'exit' }
          ]
        }]);

        if (action === 'exit') {
          console.log(chalk.gray('\nGoodbye! 👋\n'));
          continueSession = false;
          break;
        }

        if (action === 'browse') {
          const browseResult = await browseByCategoryFlow(data);
          if (browseResult === 'back') continue;
          if (browseResult === 'exit') {
            continueSession = false;
            break;
          }
        } else if (action === 'search') {
          const searchResult = await searchFlow(data);
          if (searchResult === 'back') continue;
          if (searchResult === 'exit') {
            continueSession = false;
            break;
          }
        } else if (action === 'list') {
          const listResult = await listAllFlow(data);
          if (listResult === 'back') continue;
          if (listResult === 'exit') {
            continueSession = false;
            break;
          }
        }
      }
    } catch (error) {
      showErrorMessage('Failed to load boilerplates');
      console.error(chalk.red(error));
    }
  });

// Browse by category flow
async function browseByCategoryFlow(data: Registry): Promise<'back' | 'exit' | 'continue'> {
  const categories = [...new Set(data.boilerplates.map(b => b.category))];
  const { category } = await inquirer.prompt([{
    type: 'list',
    name: 'category',
    message: 'Select a category:',
    choices: [
      ...categories.map(c => ({ name: `📁 ${c}`, value: c })),
      new inquirer.Separator(),
      { name: '🔙 Back to main menu', value: 'back' }
    ]
  }]);

  if (category === 'back') return 'back';

  const filtered = data.boilerplates.filter(b => b.category === category);
  const { boilerplateId } = await inquirer.prompt([{
    type: 'list',
    name: 'boilerplateId',
    message: `Select a boilerplate from ${category}:`,
    choices: [
      ...filtered.map(b => ({
        name: `${chalk.green(b.id)} - ${chalk.gray(b.description)}`,
        value: b.id
      })),
      new inquirer.Separator(),
      { name: '🔙 Back to categories', value: 'back' },
      { name: '🏠 Back to main menu', value: 'home' }
    ]
  }]);

  if (boilerplateId === 'back') return browseByCategoryFlow(data);
  if (boilerplateId === 'home') return 'back';

  const boilerplate = data.boilerplates.find(b => b.id === boilerplateId)!;
  const result = await interactiveAdd(boilerplate);
  return result;
}

// Search flow
async function searchFlow(data: Registry): Promise<'back' | 'exit' | 'continue'> {
  const { query } = await inquirer.prompt([{
    type: 'input',
    name: 'query',
    message: 'Enter search term (or type "back" to go back):'
  }]);

  if (query.toLowerCase() === 'back') return 'back';

  const results = data.boilerplates.filter(b =>
    b.id.includes(query.toLowerCase()) ||
    b.name.toLowerCase().includes(query.toLowerCase()) ||
    b.description.toLowerCase().includes(query.toLowerCase()) ||
    b.tags.some(t => t.includes(query.toLowerCase()))
  );

  if (results.length === 0) {
    showErrorMessage('No results found');
    showTip('Try different keywords or go back to main menu');

    const { retry } = await inquirer.prompt([{
      type: 'list',
      name: 'retry',
      message: 'What would you like to do?',
      choices: [
        { name: '🔎 Search again', value: 'retry' },
        { name: '🏠 Back to main menu', value: 'back' }
      ]
    }]);

    if (retry === 'retry') return searchFlow(data);
    return 'back';
  }

  const { boilerplateId } = await inquirer.prompt([{
    type: 'list',
    name: 'boilerplateId',
    message: `Found ${results.length} result(s):`,
    choices: [
      ...results.map(b => ({
        name: `${chalk.green(b.id)} - ${chalk.gray(b.description)}`,
        value: b.id
      })),
      new inquirer.Separator(),
      { name: '🔙 Search again', value: 'back' },
      { name: '🏠 Back to main menu', value: 'home' }
    ]
  }]);

  if (boilerplateId === 'back') return searchFlow(data);
  if (boilerplateId === 'home') return 'back';

  const boilerplate = data.boilerplates.find(b => b.id === boilerplateId)!;
  const result = await interactiveAdd(boilerplate);
  return result;
}

// List all flow
async function listAllFlow(data: Registry): Promise<'back' | 'exit' | 'continue'> {
  const { boilerplateId } = await inquirer.prompt([{
    type: 'list',
    name: 'boilerplateId',
    message: 'Select a boilerplate:',
    choices: [
      ...data.boilerplates.map(b => ({
        name: `${chalk.green(b.id)} - ${chalk.gray(b.description)} ${chalk.dim(`[${b.category}]`)}`,
        value: b.id
      })),
      new inquirer.Separator(),
      { name: '🏠 Back to main menu', value: 'back' }
    ]
  }]);

  if (boilerplateId === 'back') return 'back';

  const boilerplate = data.boilerplates.find(b => b.id === boilerplateId)!;
  const result = await interactiveAdd(boilerplate);
  return result;
}

// Helper function for interactive add
async function interactiveAdd(boilerplate: Boilerplate): Promise<'back' | 'exit' | 'continue'> {
  console.log('');
  console.log(chalk.bold.cyan(`📦 ${boilerplate.name} v${boilerplate.version}`));
  console.log(chalk.gray(boilerplate.description));
  console.log('');
  console.log(chalk.gray(`Category: ${boilerplate.category}`));
  console.log(chalk.gray(`Files: ${boilerplate.files} | Components: ${boilerplate.components || 0} | Lib: ${boilerplate.lib || 0}`));
  console.log(chalk.gray(`Tags: ${boilerplate.tags.join(', ')}`));

  if (boilerplate.dependencies.length > 0) {
    console.log('');
    console.log(chalk.yellow('📦 Dependencies:'));
    boilerplate.dependencies.forEach(dep => {
      console.log(chalk.gray(`  • ${dep}`));
    });
  }

  console.log('');

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { name: '✅ Install this boilerplate', value: 'install' },
      { name: '🔙 Go back', value: 'back' },
      { name: '🏠 Back to main menu', value: 'home' },
      { name: '❌ Exit', value: 'exit' }
    ]
  }]);

  if (action === 'back') return 'back';
  if (action === 'home') return 'back';
  if (action === 'exit') {
    console.log(chalk.gray('\nGoodbye! 👋\n'));
    return 'exit';
  }

  if (action !== 'install') {
    return 'back';
  }

  const { destPath } = await inquirer.prompt([{
    type: 'input',
    name: 'destPath',
    message: 'Where should we install it?',
    default: './src'
  }]);

  const fullPath = path.join(process.cwd(), destPath, boilerplate.id);

  if (await fs.pathExists(fullPath)) {
    const { overwrite } = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: chalk.yellow(`⚠️  Directory ${fullPath} already exists. Overwrite?`),
      default: false
    }]);

    if (!overwrite) {
      console.log(chalk.gray('\nCancelled.\n'));
      return 'back';
    }
  }

  const spinner = ora(`Downloading ${boilerplate.name}...`).start();

  try {
    await downloadBoilerplate(boilerplate, fullPath, spinner);
    spinner.succeed(chalk.green(`✓ ${boilerplate.name} added successfully!`));

    console.log('');
    console.log(chalk.bold.green('🎉 Success!'));
    console.log('');
    console.log(chalk.gray('Location: ') + chalk.cyan(fullPath));

    if (boilerplate.dependencies.length > 0) {
      console.log('');
      console.log(chalk.yellow('📦 Next steps:'));
      console.log('');
      console.log(chalk.gray('1. Install dependencies:'));
      console.log(chalk.cyan(`   npm install ${boilerplate.dependencies.join(' ')}`));
    }

    console.log('');
    console.log(chalk.gray('2. Read the README:'));
    console.log(chalk.cyan(`   ${fullPath}/README.md`));
    console.log('');

    // Ask what to do next
    const { nextAction } = await inquirer.prompt([{
      type: 'list',
      name: 'nextAction',
      message: 'What would you like to do next?',
      choices: [
        { name: '➕ Add another boilerplate', value: 'continue' },
        { name: '🏠 Back to main menu', value: 'back' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }]);

    if (nextAction === 'exit') {
      console.log(chalk.gray('\nGoodbye! 👋\n'));
      return 'exit';
    }

    return nextAction === 'continue' ? 'back' : 'back';
  } catch (error) {
    spinner.fail(chalk.red('Failed to download boilerplate'));
    console.error(chalk.red(error));

    const { retry } = await inquirer.prompt([{
      type: 'list',
      name: 'retry',
      message: 'What would you like to do?',
      choices: [
        { name: '🔄 Try again', value: 'retry' },
        { name: '🏠 Back to main menu', value: 'back' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }]);

    if (retry === 'exit') {
      console.log(chalk.gray('\nGoodbye! 👋\n'));
      return 'exit';
    }

    if (retry === 'retry') {
      return interactiveAdd(boilerplate);
    }

    return 'back';
  }
}

// List all boilerplates
program
  .command('list')
  .description('📋 List all available boilerplates')
  .option('-c, --category <category>', 'Filter by category')
  .action(async (options) => {
    const spinner = ora('Fetching boilerplates...').start();

    try {
      const { data } = await axios.get<Registry>(REGISTRY_URL);
      spinner.succeed(chalk.green('✓ Boilerplates loaded'));

      let boilerplates = data.boilerplates;

      if (options.category) {
        boilerplates = boilerplates.filter(b => b.category === options.category);
      }

      console.log('');
      console.log(chalk.bold.cyan(`📦 ${data.name} v${data.version}`));
      console.log(chalk.gray(`Total: ${boilerplates.length} boilerplates`));
      console.log('');

      const grouped = boilerplates.reduce((acc, b) => {
        if (!acc[b.category]) acc[b.category] = [];
        acc[b.category].push(b);
        return acc;
      }, {} as Record<string, Boilerplate[]>);

      Object.entries(grouped).forEach(([category, items]) => {
        console.log(chalk.bold.yellow(`\n📁 ${category.toUpperCase()}`));
        items.forEach(b => {
          console.log(chalk.green(`  ✓ ${b.id}`) + chalk.gray(` - ${b.description}`));
          console.log(chalk.dim(`    ${b.files} files | ${b.components || 0} components | ${b.lib || 0} lib files`));
        });
      });

      console.log('');
      showTip('Use "techshu browse" for interactive mode or "techshu add <id>" to install');
    } catch (error) {
      spinner.fail(chalk.red('Failed to fetch boilerplates'));
      console.error(chalk.red(error));
    }
  });

// Search boilerplates
program
  .command('search <query>')
  .description('🔍 Search for boilerplates')
  .action(async (query) => {
    const spinner = ora('Searching...').start();

    try {
      const { data } = await axios.get<Registry>(REGISTRY_URL);

      const results = data.boilerplates.filter(b =>
        b.id.includes(query.toLowerCase()) ||
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.description.toLowerCase().includes(query.toLowerCase()) ||
        b.tags.some(t => t.includes(query.toLowerCase()))
      );

      spinner.succeed(chalk.green(`✓ Found ${results.length} result(s)`));

      if (results.length === 0) {
        console.log('');
        console.log(chalk.yellow('😕 No results found for "' + query + '"'));
        console.log('');
        showTip('Try different keywords like "auth", "admin", "email", "ai", "rag"');
        return;
      }

      console.log('');
      console.log(chalk.bold.cyan(`🔍 Search results for "${query}":`));
      console.log('');

      results.forEach((b, index) => {
        console.log(chalk.bold.green(`${index + 1}. ${b.id}`));
        console.log(chalk.gray(`   ${b.description}`));
        console.log(chalk.dim(`   📁 ${b.category} | 📄 ${b.files} files | 🏷️  ${b.tags.join(', ')}`));
        console.log('');
      });

      showTip(`Use "techshu add <id>" to install or "techshu info <id>" for details`);
    } catch (error) {
      spinner.fail(chalk.red('Search failed'));
      console.error(chalk.red(error));
    }
  });

// Get info about a boilerplate
program
  .command('info <boilerplate>')
  .description('ℹ️  Get detailed information about a boilerplate')
  .action(async (boilerplateId) => {
    const spinner = ora('Fetching information...').start();

    try {
      const { data } = await axios.get<Registry>(REGISTRY_URL);
      const boilerplate = data.boilerplates.find(b => b.id === boilerplateId);

      if (!boilerplate) {
        spinner.fail(chalk.red(`Boilerplate "${boilerplateId}" not found`));
        console.log('');
        showTip('Use "techshu list" to see all available boilerplates');
        return;
      }

      spinner.succeed(chalk.green('✓ Information loaded'));

      console.log('');
      console.log(chalk.bold.cyan('╔════════════════════════════════════════════════════════════╗'));
      console.log(chalk.bold.cyan('║') + chalk.bold.white(`  📦 ${boilerplate.name} v${boilerplate.version}`.padEnd(58)) + chalk.bold.cyan('║'));
      console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════╝'));
      console.log('');
      console.log(chalk.gray('📝 Description:'));
      console.log(chalk.white(`   ${boilerplate.description}`));
      console.log('');
      console.log(chalk.gray('📁 Category: ') + chalk.cyan(boilerplate.category));
      console.log(chalk.gray('📂 Path: ') + chalk.cyan(boilerplate.path));
      console.log('');
      console.log(chalk.gray('📊 Contents:'));
      console.log(chalk.white(`   • ${boilerplate.files} files`));
      console.log(chalk.white(`   • ${boilerplate.components || 0} components`));
      console.log(chalk.white(`   • ${boilerplate.lib || 0} lib files`));
      console.log('');
      console.log(chalk.gray('🏷️  Tags: ') + chalk.cyan(boilerplate.tags.join(', ')));

      if (boilerplate.dependencies.length > 0) {
        console.log('');
        console.log(chalk.yellow('📦 Dependencies:'));
        boilerplate.dependencies.forEach(dep => {
          console.log(chalk.white(`   • ${dep}`));
        });
      }

      console.log('');
      console.log(chalk.bold.green('🚀 Ready to install?'));
      console.log(chalk.cyan(`   techshu add ${boilerplate.id}`));
      console.log('');
    } catch (error) {
      spinner.fail(chalk.red('Failed to fetch information'));
      console.error(chalk.red(error));
    }
  });

// Add a boilerplate
program
  .command('add <boilerplate>')
  .description('➕ Add a boilerplate to your project')
  .option('-p, --path <path>', 'Destination path', './src')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (boilerplateId, options) => {
    const spinner = ora('Fetching boilerplate...').start();

    try {
      const { data } = await axios.get<Registry>(REGISTRY_URL);
      const boilerplate = data.boilerplates.find(b => b.id === boilerplateId);

      if (!boilerplate) {
        spinner.fail(chalk.red(`Boilerplate "${boilerplateId}" not found`));
        console.log('');
        showTip('Use "techshu list" to see all available boilerplates');
        return;
      }

      spinner.text = `Downloading ${boilerplate.name}...`;

      const destPath = path.join(process.cwd(), options.path, boilerplate.id);

      // Check if destination exists
      if (await fs.pathExists(destPath) && !options.force) {
        spinner.stop();
        console.log('');
        const { overwrite } = await inquirer.prompt([{
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow(`⚠️  Directory ${destPath} already exists. Overwrite?`),
          default: false
        }]);

        if (!overwrite) {
          console.log('');
          console.log(chalk.gray('Cancelled. No changes made.'));
          console.log('');
          return;
        }
        spinner.start(`Downloading ${boilerplate.name}...`);
      }

      // Download files
      let filesDownloaded = 0;
      await downloadBoilerplate(boilerplate, destPath, spinner, (filename) => {
        filesDownloaded++;
        spinner.text = `Downloading ${filename}... (${filesDownloaded} files)`;
      });

      spinner.succeed(chalk.green(`✓ ${boilerplate.name} added successfully!`));

      console.log('');
      console.log(chalk.bold.green('🎉 Success!'));
      console.log('');
      console.log(chalk.gray('📁 Location: ') + chalk.cyan(destPath));
      console.log(chalk.gray('📄 Files downloaded: ') + chalk.cyan(filesDownloaded));

      if (boilerplate.dependencies.length > 0) {
        console.log('');
        console.log(chalk.yellow('📦 Next steps:'));
        console.log('');
        console.log(chalk.gray('1. Install dependencies:'));
        console.log(chalk.cyan(`   npm install ${boilerplate.dependencies.join(' ')}`));
      }

      console.log('');
      console.log(chalk.gray('2. Read the README:'));
      console.log(chalk.cyan(`   ${destPath}/README.md`));
      console.log('');

      showTip('Run "techshu browse" to add more boilerplates!');

    } catch (error) {
      spinner.fail(chalk.red('Failed to add boilerplate'));
      console.error(chalk.red(error));
    }
  });

async function downloadBoilerplate(
  boilerplate: Boilerplate,
  destPath: string,
  spinner: ora.Ora,
  onFileDownload?: (filename: string) => void
) {
  // Create destination directory
  await fs.ensureDir(destPath);

  // Use GitHub API to get directory contents
  const githubApiUrl = `https://api.github.com/repos/teachskillofskills-ai/techshu-boilerplates/contents/${boilerplate.path}`;

  try {
    const { data } = await axios.get(githubApiUrl);

    if (!Array.isArray(data)) {
      throw new Error('Invalid response from GitHub API');
    }

    // Download all files and directories
    for (const item of data) {
      if (item.type === 'file') {
        if (onFileDownload) onFileDownload(item.name);
        await downloadFile(item.download_url, path.join(destPath, item.name));
      } else if (item.type === 'dir') {
        await downloadDirectoryRecursive(item.path, path.join(destPath, item.name), spinner, onFileDownload);
      }
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`Boilerplate "${boilerplate.id}" not found in repository`);
    }
    throw error;
  }
}

async function downloadDirectoryRecursive(
  githubPath: string,
  destPath: string,
  spinner: ora.Ora,
  onFileDownload?: (filename: string) => void
) {
  await fs.ensureDir(destPath);

  const githubApiUrl = `https://api.github.com/repos/teachskillofskills-ai/techshu-boilerplates/contents/${githubPath}`;

  try {
    const { data } = await axios.get(githubApiUrl);

    if (!Array.isArray(data)) {
      return;
    }

    for (const item of data) {
      if (item.type === 'file') {
        const fileName = path.basename(item.name);
        if (onFileDownload) onFileDownload(fileName);
        await downloadFile(item.download_url, path.join(destPath, fileName));
      } else if (item.type === 'dir') {
        await downloadDirectoryRecursive(item.path, path.join(destPath, item.name), spinner, onFileDownload);
      }
    }
  } catch (error) {
    // Directory might not exist or be empty - silently skip
  }
}

async function downloadFile(url: string, destPath: string) {
  try {
    const { data } = await axios.get(url, { responseType: 'text' });
    await fs.writeFile(destPath, data, 'utf-8');
  } catch (error: any) {
    console.log(chalk.yellow(`  Warning: Failed to download ${path.basename(destPath)}`));
  }
}

program.parse();

