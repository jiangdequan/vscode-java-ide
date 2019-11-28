# Change Log
All notable changes to the "vscode-java-saber" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 0.1.1 - 2019-11-27
## Fixed
- #11(wrong package name for New file under src/test/java)

## 0.1.0 - 2018-10-31
### Added
- Generate java docs

### Fixed
- Error occured at generating getter setter when the class have Internal class

## 0.0.5 - 2018-10-18
### Fixed
- Getter Setter not generated properly when using complex data types #5
- Failed to create a new file or package in Ubuntu #4

## 0.0.4 - 2018-6-22
### Added
- Sort projects by name
- Run maven goals

### Changed
- Generate Getters and Setters: change the get method name when the type of property is boolean or Boolean
- Change the menus of new java files

## 0.0.3 - 2018-6-6
### Fixed
- fix bug when get directory of java file
- fix bug when generating package name
- fix bug: can not get the selected path when use command

## 0.0.2 - 2018-6-5
### Fixed
- package without runtime node_modules

### Changed
- runtime dependencies from devDependencies to dependencies

## 0.0.1 - 2018-5-14
### Added
- Initial release