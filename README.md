<p align="center"><a href="https://github.com/jiangdequan/vscode-java-saber" target="_blank" rel="noopener noreferrer"><img width="100" src="https://raw.githubusercontent.com/jiangdequan/vscode-java-saber/master/logo.jpg" alt="Java IDE: Saber logo"></a></p>

<h1 align="center">Saber for VS Code [<a href="README_CN.md">中文</a>]</h1>

<p align="center">
    <a href="https://marketplace.visualstudio.com/items?itemName=YouMayCallMeV.vscode-java-saber"><img alt="Marketplace Version" src="https://vsmarketplacebadge.apphb.com/version-short/youmaycallmev.vscode-java-saber.svg"/></a>
    <a href="https://marketplace.visualstudio.com/items?itemName=YouMayCallMeV.vscode-java-saber"><img alt="Visual Studio Marketplace" src="https://vsmarketplacebadge.apphb.com/installs-short/youmaycallmev.vscode-java-saber.svg"/></a>
    <a href="javascript:;"><img alt="Platform" src="https://img.shields.io/badge/platform-windows|osx|linux-lightgrey.svg"/></a>
    <a href="javascript:;"><img alt="Language" src="https://img.shields.io/badge/language-javascript-orange.svg"/></a>
    <a href="javascript:;"><img alt="License" src="https://img.shields.io/badge/license-BSD&GPLv2-black.svg"/></a>
</p>

This extension includes many useful utilities for Java. To make the vscode work as Eclipse or IDEA when you are coding in java.

# Overview
It makes users coding in java more efficient. Here`s a list of features:
* New: Java files(annotation/class/interface/enum/package/JSP/HTML)
* Generate Getters and Getters
* Copy Qualified Name
* Sort Project By Name
* Run Maven Goals
* Generate Docs

Some features ready to do:
* Rename Java File

# Requirements
* JDK (version 1.8.0 or later)
* VS Code (version 1.19.0 or later)

# Install
* Install from the [Marketplace](https://marketplace.visualstudio.com/), you can find it by typing: "vscode-java-saber" "Java IDE"

# How To Use
PS: These functions are implemented by parsing strings in java files. Therefore, your codes should best meet the specification of java.

## New
* __Method 1__: Right click on a java file or a directory in the explorer
![Alt text](./preview/java.ide.new.method1.step1.png)
![Alt text](./preview/java.ide.new.method1.step2.png)

* __Method 2__: You must open a java file in text editor => ctrl + shift + p => type: java new
![Alt text](./preview/java.ide.new.method2.png)
It will create a java file in the same directory of the opened file.

## Generate Getters and Setters
__Known issue: When the inner class is defined in the class, there will be problems with generating getters and setters__
* __Method 1__: Right click on the opened java file in the editor
![Alt text](./preview/java.ide.generate.getter.setter.method1.png)

* __Method 2__: You must open a java file in text editor => ctrl + shift + p => type: getter setter
![Alt text](./preview/java.ide.generate.getter.setter.method2.png)

* __Method 3__: Use keyboard shortcut 'alt + insert'

## Copy Qualified Name
* __Method 1__: Right click on the opened java file in the explorer
![Alt text](./preview/java.ide.copy.qualified.name.method1.png)

* __Method 2__: You must open a java file in text editor => ctrl + shift + p => type: copy qualified name
![Alt text](./preview/java.ide.copy.qualified.name.method2.png)

* __Method 3__: Right click on the opened java file in the editor
![Alt text](./preview/java.ide.copy.qualified.name.method3.png)

## Sort Project By Name
Edit the config "ide.projectAutoSort" to true, it will auto sort projects by name when adding a project to the workspace, default is false

* __Method 1__: Right click on the project explorer
![Alt text](./preview/java.ide.sort.project.method1.png)

* __Method 2__: ctrl + shift + p => type: Sort Project By Name
![Alt text](./preview/java.ide.sort.project.method2.png)

## Run Maven Goals
Edit the config "ide.mavenDefaultGoals" to what you like, default is "clean install -Dmaven.test.skip=true" and "clean install"

* __Method 1__: Right click on a pom.xml file
![Alt text](./preview/java.ide.run.as.method1.step1.png)
![Alt text](./preview/java.ide.run.as.method1.step2.png)

## Generate Docs
* __Method 1__: 
1. Select the codes you want to generate java docs as below
![Alt text](./preview/java.ide.generate.docs.method1.step1.1.png)
![Alt text](./preview/java.ide.generate.docs.method1.step1.2.png)

2. Then right click on the opened java file in the editor or use keyboard shortcut 'alt + i'
![Alt text](./preview/java.ide.generate.docs.method1.step2.1.png)

# Feedback and Questions
You can find the full list of issues at [Issue Tracker](https://github.com/jiangdequan/vscode-java-saber/issues). You can submit a [bug or feature suggestion](https://github.com/jiangdequan/vscode-java-saber/issues/new).

# License
Dual-licensed under [BSD 2-Clause License](http://opensource.org/licenses/BSD-2-Clause) and [GPLv2 with the Classpath Exception](http://openjdk.java.net/legal/gplv2+ce.html).

![](https://raw.githubusercontent.com/paulvi/vscode-java-ide-pack/master/duke-plug.png)
This extention is included into ["Java IDE Pack" extention pack](https://github.com/paulvi/vscode-java-ide-pack/).
