const Cord = require('../models/cord');
const Airport = require('../models/airport');
class Node {
    constructor(x, y, g, parent = null) {
        this.x = x;
        this.y = y;
        this.g = g; // Cost from start to this node
        this.parent = parent;
    }
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0], // 4 directions
    ];

    for (const [dx, dy] of directions) {
        const x = node.x + dx;
        const y = node.y + dy;
        // if (node.x == 0 && node.y == 1) {
        // console.log("find", x, " ", y);
        // }
        if (grid[x] && grid[x][y] !== undefined && grid[x][y] !== 0) {
            // if (node.x == 0 && node.y == 1) {
            // console.log("find", x, " ", y);
            // }
            neighbors.push(new Node(x, y, 0));
        }
    }
    const directions2 = [[1, 1], [1, -1], [-1, 1], [-1, -1]]; // Diagonals
    for (const [dx, dy] of directions2) {
        const x = node.x + dx;
        const y = node.y + dy;
        const x1 = node.x + dx;
        const y1 = node.y;
        const x2 = node.x;
        const y2 = node.y + dy;

        if (grid[x] && grid[x][y] && grid[x][y] !== undefined && grid[x][y] !== 0
            && ((grid[x1][y1] !== undefined && grid[x1][y1] !== 0) ||
                (grid[x2][y2] !== undefined && grid[x2][y2] !== 0))
        ) {
            neighbors.push(new Node(x, y, 0));
        }
    }


    return neighbors;
}

function dijkstra(start, goal, grid) {
    // console.log(start, " ", goal);
    const openSet = [];
    const closedSet = new Set();
    const startNode = new Node(start.x, start.y, 0);
    openSet.push(startNode);

    while (openSet.length > 0) {
        // Get the node with the lowest g score
        openSet.sort((a, b) => a.g - b.g);
        const current = openSet.shift();

        if (current.x === goal.x && current.y === goal.y) {
            // Reconstruct path
            const path = [];
            let temp = current;
            while (temp) {
                path.push({ x: temp.x, y: temp.y });
                temp = temp.parent;
            }
            return path.reverse();
        }

        closedSet.add(`${current.x},${current.y}`);

        for (const neighbor of getNeighbors(current, grid)) {
            if (closedSet.has(`${neighbor.x},${neighbor.y}`)) {
                continue;
            }

            const tentativeG = current.g + 1; // Assuming cost between nodes is 1

            if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                neighbor.g = tentativeG;
                neighbor.parent = current;
                openSet.push(neighbor);
            } else {
                const existingNode = openSet.find(node => node.x === neighbor.x && node.y === neighbor.y);
                if (tentativeG < existingNode.g) {
                    existingNode.g = tentativeG;
                    existingNode.parent = current;
                }
            }
        }
    }

    return []; // No path found
}

async function createGridFromDatabase(cords) {
    const grid = [];

    cords.forEach((cord) => {
        if (!grid[cord.x]) {
            grid[cord.x] = [];
        }
        grid[cord.x][cord.y] = cord.reserve || cord.weather != "good" ? 0 : 1;
    });

    return grid;
}

const reserveCords = async (path, start, goal) => {
    const reservedCords = [];
    for (const coord of path) {
        const checkAirport = await Airport.find({ x: coord.x, y: coord.y });
        if (checkAirport.length == 0) {
            await Cord.findOneAndUpdate({ x: coord.x, y: coord.y }, { reserve: true });
        }
        const cord = { x: coord.x, y: coord.y };
        reservedCords.push(cord);
    }
    return reservedCords;
}

module.exports = {
    dijkstra,
    createGridFromDatabase,
    reserveCords
};
